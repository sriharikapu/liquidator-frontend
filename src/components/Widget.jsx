import React, { Component } from 'react';
import CloseWidget from './CloseWidget';

import Wallets from './Wallets';
import LockedAccount from './LockedAccount';
import { isAddress } from '../helpers';
import HardWallet from "./HardWallet";

class Widget extends Component {
  render() {
    return (
      <div className={`Widget ${this.props.section}`}>
        {
          this.props.hw.showModal
            ? <HardWallet loadingAddress={this.props.loadingAddress}
                          hw={this.props.hw}
                          onBack={this.props.showClientChoice}
                          loadHWAddresses={this.props.loadHWAddresses}
                          selectHWAddress={this.props.selectHWAddress}
                          importAddress={this.props.importAddress}/>
            : !this.props.isConnected || this.props.loadingFirstAddress
            ? <Wallets setWeb3WebClient={this.props.setWeb3WebClient} showHW={this.props.showHW} loadingAddress={this.props.loadingAddress} />
            : this.props.account && isAddress(this.props.account)
              ? <div>
                {
                  <CloseWidget />
                }
              </div>
              // Create a decorator Component that returns a component which is wrapped into element with only back function passed as argument
              : <LockedAccount onBack={this.props.showClientChoice}/>
        }
      </div>
    )
  }
}

export default Widget;
