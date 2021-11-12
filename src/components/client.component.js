import React, { Component } from "react";
import { Row, Col, Divider } from "antd";
import Endpoint from "./endpoint.component";
import Drive from "./drive.component";
import AddDrive from "./addDrive.component";
import AddEndpoint from "./addEndpoint.component";

export default class Client extends Component {
  state = { client: null, driveModel: false };

  componentDidMount() {
    // get client information using client id
    this.setState({
      client: {
        id: "1234",
        drives: [
          { id: "123", properties: [{ name: "protocol", value: "ModBus" }] },
          { id: "456", properties: [{ name: "protocol", value: "ethernet" }] },
        ],
        endpoints: [
          {
            id: "123",
            properties: [
              { name: "host:", value: "localhost:1899" },
              { name: "protocol", value: "tcp" },
            ],
          },
        ],
      },
    });
  }

  changeDriveModal = () => {
    this.setState({ driveModal: !this.state.driveModal });
  };

  render() {
    return this.state.client ? (
      <>
        <Divider orientation="left">Endpoints</Divider>
        <Row gutter={16}>
          <Col span={5}>
            <AddEndpoint />
          </Col>
          {this.state.client.endpoints.map((endpoint) => (
            <Col span={5}>
              <Endpoint
                id={endpoint.id}
                properties={endpoint.properties}
                key={endpoint.id}
              />
            </Col>
          ))}
        </Row>
        <Divider orientation="left">Drives</Divider>
        <Row gutter={16}>
          <Col span={5}>
            <AddDrive />
          </Col>
          {this.state.client.drives.map((drive) => (
            <Col span={5}>
              <Drive
                id={drive.id}
                properties={drive.properties}
                key={drive.id}
              />
            </Col>
          ))}
        </Row>
      </>
    ) : (
      <></>
    );
  }
}
