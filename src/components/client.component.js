import React, { Component } from "react";
import { Row, Col, Divider, Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Endpoint from "./endpoint.component";
import Drive from "./drive.component";
import AddDrive from "./addDrive.component";
import AddEndpoint from "./addEndpoint.component";

export default class Client extends Component {
  state = { client: null, driveModel: false };

  componentDidMount() {
    // FETCH client information using client id GET /api/clients/<id>
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
              { name: "host", value: "localhost:1899" },
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
        <Row>
          <Col span={12}>
            <Divider orientation="left">Endpoints</Divider>
          </Col>
          <Col span={12}>
            <Divider orientation="right">
              <AddEndpoint />
            </Divider>
          </Col>
        </Row>
        {this.state.client.endpoints ? (
          <Row gutter={16}>
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
        ) : (
          <Empty description={<span>No endpoint added yet!</span>}>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Endpoint
            </Button>
          </Empty>
        )}
        <Row>
          <Col span={12}>
            <Divider orientation="left">Drives</Divider>
          </Col>
          <Col span={12}>
            <Divider orientation="right">
              <AddDrive />
            </Divider>
          </Col>
        </Row>
        {this.state.client.drives ? (
          <Row gutter={16}>
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
        ) : (
          <Empty description={<span>No drive added yet!</span>}>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Drive
            </Button>
          </Empty>
        )}
      </>
    ) : (
      <></>
    );
  }
}
