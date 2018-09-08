import React, { Component } from 'react';
import web3 from '../web3';
import * as Blockchain from '../blockchainHandler';

const KOVAN_SAI_TUB = '0xa71937147b55deb8a530c7229c442fd3f31b7db2';
const KOVAN_LIQUIDATOR = '0x47894c96e934a9f43f6ad782e2bc12b2bbc0160b';

const padLeft = (string, chars, sign) => {
  return new Array(chars - string.length + 1).join(sign ? sign : '0') + string;
};

const toBytes32 = (x, prefix = true) => {
  let y = web3.toHex(x);
  y = y.replace('0x', '');
  y = padLeft(y, 64);
  if (prefix) y = '0x' + y;
  return y;
};

class CloseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.giveCdp = this.giveCdp.bind(this);
    this.closeCdp = this.closeCdp.bind(this);
  }

  handleChange(event) {
    this.setState({ cdpId: event.target.value });
  }

  giveCdp() {
    const tub = web3.eth.contract(Blockchain.schema.saitub).at(KOVAN_SAI_TUB);

    console.log(`GIVING ${this.state.cdpId} to ${KOVAN_LIQUIDATOR}`);
    tub.give(toBytes32(this.state.cdpId), KOVAN_LIQUIDATOR, err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('GIVEN :)');
    });
  }

  closeCdp() {
    const liquidator = web3.eth
      .contract(Blockchain.schema.liquidator)
      .at(KOVAN_LIQUIDATOR);

    console.log(`CLOSING ${this.state.cdpId}`);
    liquidator.close(toBytes32(this.state.cdpId), err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('CLOSED :)');
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
        <button onClick={this.giveCdp}>give CDP to liquidator</button>
        <br />
        <button onClick={this.closeCdp}>liquidate CDP</button>
      </section>
    );
  }
}

export default CloseWidget;
