import React, { Component } from "react";
import Helmet from "react-helmet";
import { Container, Navbar } from "react-bootstrap";
import "./App.css";
import axios from "axios";
import TradingPairs from "./components/TradingPairs";
import Stream from "./components/Stream";

const tpAPI = "https://www.bitstamp.net/api/v2/trading-pairs-info/";

export class App extends Component {
  state = {
    tradingPairs: [],
    streams: [],
    selected: "waiting for pair",
    streamsLoaded: false,
    tradingPairsLoaded: false
  };

  getTradingPairs = () => {
    axios.get(tpAPI).then(response => {
      this.setState({
        tradingPairs: response.data,
        tradingPairsLoaded: true
      });
    });
  };

  selectedPair = pair => {
    this.setState({
      selected: pair,
      selectedOptionPassed: true
    });
  };

  componentDidMount() {
    this.getTradingPairs();
  }

  render() {
    const { tradingPairs, selected, selectedOptionPassed } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Busha Frontend Developer Challenge</title>
        </Helmet>

        <Container fluid={true} className="py-3">
          <Navbar bg="dark" variant="dark" className="mb-4">
            <Navbar.Brand href="#home">
              {"Busha Frontend Developer Challenge"}
            </Navbar.Brand>
          </Navbar>
          <TradingPairs data={tradingPairs} selectedPair={this.selectedPair} />

          {selectedOptionPassed ? (
            <Stream value={selected} />
          ) : (
            <p className="text-center">waiting on your selection...</p>
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
