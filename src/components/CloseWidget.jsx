import React, { Component } from 'react';
import web3 from './web3';

class CloseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ cdpId: event.target.value });
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

        <button>give CDP to liquidator</button>
        <button>liquidate CDP</button>
      </section>
    );
  }
}

export default CloseWidget;
