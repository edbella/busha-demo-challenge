import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";

//var socket = new WebSocket("wss://ws.bitstamp.net/");

export class Stream extends Component {
  state = {
    ws: [],
    socket: null
  };

  // single websocket instance for the own application and constantly trying to reconnect.

  componentDidMount() {
    this.connect(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.connect(this.props.value);
    }
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = (url, oldUrl) => {
    if (this.state.socket) {
      this.state.socket.close();
    }

    var socket = new WebSocket("wss://ws.bitstamp.net/");
    let that = this; // cache the this
    var subscribeMsg = {
      event: "bts:subscribe",
      data: {
        channel: "order_book_" + this.props.value
      }
    };

    function serializeData(data) {
      //console.log(data);
      that.setState({
        asks: data.asks,
        bids: data.bids,
        connected: true
      });
    }

    // websocket onopen event listener
    socket.onopen = () => {
      socket.send(JSON.stringify(subscribeMsg));
      console.log("connected websocket main component");
    };

    socket.onmessage = function(evt) {
      var response = JSON.parse(evt.data);
      //console.log(response);
      /**
       * This switch statement handles message logic. It processes data in case of data event
       * and it reconnects if the server requires.
       */
      switch (response.event) {
        case "data": {
          serializeData(response.data);
          break;
        }
        default: {
          //console.log("Error in case assignment");
          break;
        }
      }
    };
    // websocket onclose event listener
    socket.onclose = e => {
      console.log("Socket is closed");
    };

    // websocket onerror event listener
    socket.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
    };

    this.setState({ socket });
  };

  render() {
    const { asks, bids, connected } = this.state;
    var count = 0;
    return (
      <div>
        <Col className="mx-auto mt-3" md={10} lg={9}>
          <Row noGutters={true} className="border text-center">
            <Col className="list">
              <h4 className="bg-grey py-3 text-center">Bids</h4>

              {connected
                ? bids.map(bid => {
                    return (
                      <p key={count++}>
                        <span className="font-weight-bold">{bid[1]}</span> at{" "}
                        <span className="font-weight-bold">{bid[0]}</span>
                      </p>
                    );
                  })
                : console.log("waiting for socket response")}
            </Col>

            <Col className="list">
              <h4 className="bg-grey py-3 text-center">Asks</h4>

              {connected
                ? asks.map(ask => {
                    return (
                      <p key={count++}>
                        <span className="font-weight-bold">{ask[1]}</span> at{" "}
                        <span className="font-weight-bold">{ask[0]}</span>
                      </p>
                    );
                  })
                : console.log("waiting for socket response")}
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default Stream;
