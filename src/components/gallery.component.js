import React, { Component } from "react";
import { Card, Col, Row, Avatar, Rate, Spin, message, Typography } from "antd";
import { CloudDownloadOutlined, EllipsisOutlined } from "@ant-design/icons";
import logo from "../static/favicon.png";

export default class AppGallery extends Component {
  state = { apps: [], loadClients: false }
  componentDidMount() {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ loadClients: true });
      // FETCH GET /api/clients/ <- all client names
      fetch("/api/clients/published", {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadClients: false, apps: data });
        })
        .catch((error) => message.warning({ content: error }));
    }
  }
  render() {
    // const data = [
    //     {
    //       avatar: <SmileOutlined />,
    //       title: "ABB Client",
    //       description: (
    //         <>
    //           <p>endpoints: modbus, opcua</p>
    //           <p>drives: ACS800</p>
    //           <Rate disabled defaultValue={4} />
    //         </>
    //       ),
    //     },
    //     {
    //       avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    //       title: "ABB Client",
    //       description: (
    //         <>
    //           <p>endpoints: modbus, opcua</p>
    //           <p>drives: ACS800</p>
    //           <Rate disabled defaultValue={4} />
    //         </>
    //       ),
    //     },
    //     {
    //       avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    //       title: "ABB Client",
    //       description: (
    //         <>
    //           <p>endpoints: modbus, opcua</p>
    //           <p>drives: ACS800</p>
    //           <Rate disabled defaultValue={4} />
    //         </>
    //       ),
    //     },
    //     {
    //       avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    //       title: "ABB Client",
    //       description: (
    //         <>
    //           <p>endpoints: modbus, opcua</p>
    //           <p>drives: ACS800</p>

    //         </>
    //       ),
    //     },
    // ];
    const { Text, Paragraph  } = Typography
    return this.state.loadClients ?
      <div className="example">
        <Spin size="large" />
      </div> :
      <div className="site-card-wrapper">
        <Row gutter={64} justify="center">
          {this.state.apps.map((d) => (
            <Col span={6}>
              <Card style={{ marginTop: 16 }}
                actions={[
                  <CloudDownloadOutlined key="download" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}>
                <Card.Meta
                  avatar={<Avatar src={logo} />}
                  title={d.name}
                  description={<>
                    <Paragraph ><Text strong>endpoints</Text>: {d.endpoints.map(e => e + ", ")}<br/>
                    <Text strong>drives</Text>: {d.drives.map(e => e + ", ")}</Paragraph >
                    <Rate disabled defaultValue={4} />
                  </>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
  }
}
