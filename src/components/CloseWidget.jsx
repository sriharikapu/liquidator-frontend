import React, { Component } from 'react';
import * as Blockchain from '../blockchainHandler';

class CloseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <section className="frame">
        <div>{this.props.account}</div>
        <div>{this.props.proxy}</div>
      </section>
    );
  }
}

export default CloseWidget;
