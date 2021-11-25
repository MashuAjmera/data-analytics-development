import React, { Component } from "react";
import { Row, Col, Divider, Empty, message, Spin } from "antd";
import Element from "./element.component";
import AddDrive from "./addDrive.component";
import AddEndpoint from "./addEndpoint.component";

export default class Client extends Component {
  state = { client: {}, loadClient: true, token: null, xyz: null };

  componentDidMount() {
    this.getClient();
    // this.setState({
    //   client: {
    //     id: "1234",
    //     drives: [
    //       { id: "123", properties: [{ name: "protocol", value: "ModBus" }] },
    //       { id: "456", properties: [{ name: "protocol", value: "ethernet" }] },
    //     ],
    //     endpoints: [
    //       {
    //         id: "123",
    //         properties: [
    //           { name: "host", value: "localhost:1899" },
    //           { name: "protocol", value: "tcp" },
    //         ],
    //       },
    //     ],
    //   },
    // });
  }

  setClient = (client) => {
    this.setState({ client });
  };

  getClient = () => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ loadClient: true });
      // FETCH client information using client id GET /api/clients/<id>
      fetch(`/api/clients/${this.props._id}`, {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setClient(data.client);
          this.setState({ loadClient: false });
        })
        .catch((error) => message.warning({ content: error }));
    }
  };

  render() {
    return this.state.loadClient ? (
      <div className="example">
        <Spin size="large" />
      </div>
    ) : (
      <>
        <Row>
          <Col span={12}>
            <Divider orientation="left">Endpoints</Divider>
          </Col>
          <Col span={12}>
            <Divider orientation="right">
              <AddEndpoint
                clientId={this.props._id}
                setClient={this.setClient}
              />
            </Divider>
          </Col>
        </Row>
        {this.state.client.endpoints.length >= 1 ? (
          <Row gutter={16}>
            {this.state.client.endpoints.map((endpoint) => (
              <Col span={5} key={endpoint._id}>
              <Element element={endpoint} clientId={this.props._id} setClient={this.setClient} ename={"endpoint"}/>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description={<span>No endpoint added yet!</span>} />
        )}
        <Row>
          <Col span={12}>
            <Divider orientation="left">Drives</Divider>
          </Col>
          <Col span={12}>
            <Divider orientation="right">
              <AddDrive 
                clientId={this.props._id}
                setClient={this.setClient}/>
            </Divider>
          </Col>
        </Row>
        {this.state.client.drives.length >= 1 ? (
          <Row gutter={16}>
            {this.state.client.drives.map((drive) => (
              <Col span={5} key={drive._id}>
                <Element element={drive} clientId={this.props._id} setClient={this.setClient} ename={"drive"}/>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description={<span>No drive added yet!</span>} />
        )}
      </>
    );
  }
}
