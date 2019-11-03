import React, { Component } from "react";
import { Col, Form } from "react-bootstrap";

export class TradingPairs extends Component {
  state = {
    pair: ""
  };
  selectedPair = e => {
    this.props.selectedPair(e.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <Col md={6} className="mx-auto">
          <h6 className="text-center mb-4">
            Please select a Trading Pair Currency
          </h6>

          <Form.Control
            as="select"
            onChange={this.selectedPair}
            defaultValue={"Select Pair"}
          >
            <option value="Select Pair" disabled={true}>
              Select Pair
            </option>
            {this.props.data.map(item => {
              return (
                <option key={item.url_symbol} value={item.url_symbol}>
                  {item.name}
                </option>
              );
            })}
          </Form.Control>
        </Col>
      </React.Fragment>
    );
  }
}

export default TradingPairs;
