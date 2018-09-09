import React, { Component } from 'react';
import web3 from '../web3';
import { toBytes32, addressToBytes32, methodSig } from '../helpers';
import * as Blockchain from '../blockchainHandler';

const KOVAN_SAI_TUB = '0xa71937147b55deb8a530c7229c442fd3f31b7db2';
const KOVAN_LIQUIDATOR = '0x49db80eede41828680967e3b54c295148b111d58';
const KOVAN_LIQUIDATOR_PROXY = '0xd74a2649b334a5456ca0b5ddad945b8f8a335e34';
const KOVAN_PETH = '0xf4d791139ce033ad35db2b2201435fad668b1b64';
const KOVAN_PROXY_REGISTRY = '0x64a436ae831c1672ae81f674cab8b6775df3475c';

const check = (err, data) => {
  if (err) {
    throw err;
  }
};

class CloseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { proxy: this.props.proxy };
    this.handleChange = this.handleChange.bind(this);
    this.createProxy = this.createProxy.bind(this);
    this.allowProxyPeth = this.allowProxyPeth.bind(this);
    this.giveCdp = this.giveCdp.bind(this);
    this.closeCdp = this.closeCdp.bind(this);
  }

  handleChange(event) {
    this.setState({ cdpId: event.target.value });
  }

  createProxy() {
    const proxyRegistry = web3.eth
      .contract(Blockchain.objects.proxyRegistry.abi)
      .at(KOVAN_PROXY_REGISTRY);

    proxyRegistry.build(err => check(err));

    const timer = setInterval(async () => {
      const proxy = await Blockchain.getProxy(this.props.account);

      if (proxy) {
        console.log(proxy);
        this.setState({ proxy: proxy });
        clearInterval(timer);
      }
    }, 250);
  }

  allowProxyPeth() {
    const peth = web3.eth
      .contract(Blockchain.schema.dstoken.abi)
      .at(KOVAN_PETH);

    console.log(`APPROVING ${this.state.proxy} to transfer PETH`);
    peth.approve(
      this.state.proxy,
      toBytes32(web3.toWei(10000, 'ether')),
      err => {
        check(err);
        console.log('approve tx sent');
      }
    );
  }

  giveCdp() {
    const tub = web3.eth.contract(Blockchain.schema.saitub).at(KOVAN_SAI_TUB);

    console.log(`GIVING ${this.state.cdpId} to ${this.state.proxy}`);
    tub.give(toBytes32(this.state.cdpId), this.state.proxy, err => {
      check(err);
      console.log('give tx sent');
    });
  }

  closeCdp() {
    const proxy = web3.eth
      .contract(Blockchain.schema.dsproxy.abi)
      .at(this.state.proxy);

    const callData =
      methodSig('giveAndClose(address,bytes32,address)') +
      addressToBytes32(KOVAN_SAI_TUB, false) +
      toBytes32(this.state.cdpId, false) +
      addressToBytes32(KOVAN_LIQUIDATOR, false);

    console.log(`CLOSING ${this.state.cdpId}`);
    proxy.execute['address,bytes'](KOVAN_LIQUIDATOR_PROXY, callData, err => {
      check(err);
      console.log('close tx sent');
    });
  }

  render() {
    return (
      <section className="frame">
        <form>
          <label>
            CDP ID:
            <input
              type="text"
              name="cdpId"
              value={this.state.cdpId}
              onChange={this.handleChange}
            />
          </label>
        </form>
        <br />
        <button onClick={this.createProxy}>create Proxy</button>
        <br />
        <button onClick={this.allowProxyPeth}>
          approve proxy for PETH transfer
        </button>
        <br />
        <button onClick={this.giveCdp}>give CDP to liquidator</button>
        <br />
        <button onClick={this.closeCdp}>liquidate CDP</button>
      </section>
    );
  }
}

export default CloseWidget;
