import React, { Component } from "react";
import { Row, Col, Divider, Empty, message, Spin } from "antd";
import Endpoint from "./endpoint.component";
import Drive from "./drive.component";
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

  getClient = () => {
    const token = localStorage.getItem("Authorization");
    if (token){
      this.setState({ loadClient: true });
      // FETCH client information using client id GET /api/clients/<id>
      fetch(`/api/clients/${this.props.id}`, {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadClient: false, client: data.client });
        })
        .catch((error) => message.warning({ content: error }));
    }
  };

  render() {
    return this.state.loadClient?<div className="example"><Spin size="large" /></div>:(<>
        <Row>
          <Col span={12}>
            <Divider orientation="left">Endpoints</Divider>
          </Col>
          <Col span={12}>
            <Divider orientation="right">
              <AddEndpoint clientId={this.props.id}/>
            </Divider>
          </Col>
        </Row>
        {this.state.client.endpoints.length>=1 ? (
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
        {this.state.client.drives.length>=1 ? (
          <Row gutter={16}>
            {this.state.client.drives.map((drive) => (
              <Col span={5}>
                <Drive
                  id={drive._id}
                  parameters={drive.parameters}
                  key={drive._id}
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
