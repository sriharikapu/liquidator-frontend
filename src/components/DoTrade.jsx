import React, { Component } from 'react';
import web3 from '../web3';
import { Ether, MKR, DAI } from './Tokens';
import { printNumber } from '../helpers';

const spinner = (
  <span className="spinner">
     <svg width='10px' height='10px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid" className="uil-ring-alt">
       <rect x="0" y="0" width="100" height="100" fill="none" className="bk"/>
       <circle cx="50" cy="50" r="40" stroke="#F8F7F5" fill="none" strokeWidth="10" strokeLinecap="round"/>
       <circle cx="50" cy="50" r="40" stroke="#3AB493" fill="none" strokeWidth="6" strokeLinecap="round">
         <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"/>
         <animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite"
                  values="150.6 100.4;1 250;150.6 100.4"/>
       </circle>
     </svg>
  </span>
)

const tokens = {
  'eth': {
    icon: <Ether/>,
    symbol: "ETH",
    name: "Ether"
  },
  'mkr': {
    icon: <MKR/>,
    symbol: "MKR",
    name: "Maker"
  },
  'dai': {
    icon: <DAI/>,
    symbol: "DAI",
    name: "DAI",
  },
}

class DoTrade extends Component {

  token = (key) => {
    const tokens = {
      'eth': 'Ether',
      'mkr': 'Maker',
      'dai': 'Dai'
    };
    return tokens[key];
  }

  hasTxCompleted() {
    console.log(this.props.transactions);
    return this.props.transactions.trade
        && this.props.transactions.trade.tx
        && !this.props.transactions.trade.pending
        && !this.props.transactions.trade.error;
  }

  render() {
    return (
      <section className="frame">
        <div className="heading">
          <h3>Finalize Trade</h3>
        </div>
        <div className="info-box">
          <span className="label">
            Current Estimated Price
          </span>
          <span className="value">
            <span>{printNumber(web3.toWei(this.props.trade.amountPay.div(this.props.trade.amountBuy)))} </span>
            <span>{tokens[this.props.trade.from].symbol}/{tokens[this.props.trade.to].symbol}</span>
          </span>
        </div>
        {
          this.props.trade.txs === 2 &&
          <div className="transaction-info-box">
            <div className="operation">
              {tokens[this.props.trade.from].icon}
              <div className="details">
                <span className="label"> Approving</span>
              </div>
            </div>
            {
              typeof this.props.transactions.approval === 'undefined'
              ?
                <div className="status">{spinner}<span className="label">Initiating transaction...</span></div>
              :
                this.props.transactions.approval.rejected
                ?
                  <div className="status"><span className="label">Rejected, redirecting...</span></div>
                :
                  this.props.transactions.approval.requested
                  ?
                    <div className="status">{spinner}<span className="label">Signing transaction</span></div>
                  :
                    this.props.transactions.approval.pending
                    ?
                      <div className="status">{spinner}<span className="label info">Pending...</span></div>
                    :
                      this.props.transactions.approval.error
                      ?
                        <div className="status"><span className="label">error ocurred</span></div>
                      :
                        <div className="status"><span className="label info">Confirmed</span></div>
            }
          </div>
        }
        {
          this.props.trade.txs === 2 &&
          <div className="arrow-separator">
            <img alt="arrow" src="/assets/od-icons/od_arrow.svg"/>
          </div>
        }
        <div className={`transaction-info-box ${this.hasTxCompleted() ? 'success' : ''}`}>
          <span className={`done-placeholder ${this.hasTxCompleted() ? 'show' : ''}`}>
            <span className="done">
              <img width="10px" height="10px" alt="done" src="/assets/od-icons/od_done.svg" type="svg"/>
            </span>
          </span>
          <div>
            <div className="operation">
              <span className="icon">{tokens[this.props.trade.from].icon}</span>
              <div className="details">
                <span className="label"> Selling</span>
                <span
                  className="value"> {printNumber(web3.toWei((this.props.trade.amountPay.valueOf())))} {tokens[this.props.trade.from].symbol}</span>
              </div>
            </div>
            <div className="operation">
              <span className="icon">{tokens[this.props.trade.to].icon}</span>
              <div className="details">
                <span className="label"> Buying</span>
                <span
                  className="value"> {printNumber(web3.toWei((this.props.trade.amountBuy.valueOf())))} {tokens[this.props.trade.to].symbol}</span>
              </div>
            </div>
          </div>
          {
            typeof this.props.transactions.trade === 'undefined'
              ?
              this.props.trade.txs === 1
              ?
                <div className="status">{spinner}<span className="label">initiating transaction</span></div>
              :
                <div className="status">{spinner}<span className="label">waiting for previous tx to complete</span></div>
            :
              this.props.transactions.trade.rejected
              ?
                <div className="status"><span className="label error">Rejected, redirecting...</span></div>
              :
                this.props.transactions.trade.requested
                ?
                  <div className="status">{spinner}<span className="label">Signing transaction</span></div>
                :
                  this.props.transactions.trade.pending
                  ?
                    <div className="status">{spinner}<span className="label info">Pending...</span></div>
                  :
                    this.props.transactions.trade.error
                    ?
                      <div className="status"><span className="label error">Error occurred, redirecting...</span></div>
                    :
                      <div className="status"><span className="label info">Confirmed</span></div>
          }
        </div>
        <div className="footer contact">
          Need help? Contact us on <a href="http://chat.makerdao.com">chat.makerdao.com</a>
        </div>
      </section>

    )
  }
}

export default DoTrade;
