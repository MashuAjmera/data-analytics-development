import React, { Component } from "react";
import { Row, Col, Divider, Button, Empty, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Endpoint from "./endpoint.component";
import Drive from "./drive.component";
import AddDrive from "./addDrive.component";
import AddEndpoint from "./addEndpoint.component";

export default class Client extends Component {
  state = { client: {}, loadClient: true, token: null, xyz: null };

  componentDidMount() {
    const token = localStorage.getItem("Authorization");
    this.setState({ token },this.getClient);
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

  getClient = () => {
    this.setState({ loadClient: true });
    // FETCH client information using client id GET /api/clients/<id>
    fetch(`/api/clients/${this.props.id}`, {
      headers: { Authorization: this.state.token },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ loadClient: false, client: data.client });
      })
      .catch((error) => message.warning({ content: error }));
  };

  render() {
    return this.state.loadClient?<div className="example"><Spin size="large" /></div>:(<>
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
          <Empty description={<span>No endpoint added yet!</span>}/>
        )}
        {/* </Skeleton.Input> */}
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
          <Empty description={<span>No drive added yet!</span>}/>
        )}
      </>
    );
  }
}
