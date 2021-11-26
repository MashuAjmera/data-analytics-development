import React, { Component } from "react";
import { Card, Col, Row, Avatar, Rate, Spin, message, Typography, Layout, Divider, Input, Checkbox, Slider } from "antd";
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
    // ];
    const { Text, Paragraph } = Typography
    const { Sider } = Layout;
    return (<Layout>
      <Sider width={300} className="site-layout-background" theme="light" style={{
        padding: "20px", height: "80vh",
        overflow: 'auto',
        position: 'fixed',
      }}>
        <Input.Search placeholder="Search app name" enterButton />
        <Divider orientation="left">Type</Divider>
        <Checkbox.Group options={[
          { label: 'Cloud', value: 'Apple' },
          { label: 'Edge', value: 'Pear' },
        ]} />
        <Divider orientation="left">Endpoints</Divider>
        <Checkbox.Group options={[
          { label: 'MQTT', value: 'Apple' },
          { label: 'IoT Hub', value: 'Pear' },
        ]} />
        <Divider orientation="left">Drives</Divider>
        <Checkbox.Group defaultChecked={false} options={[
          { label: 'ACS550', value: 'Apple' },
          { label: 'ACH550', value: 'Pear' },
          { label: 'ACS880', value: 'Orange' },
          { label: 'ACD550', value: 'Pear1' },
          { label: 'ACS800', value: 'Orange1' },
          { label: 'ACS990', value: 'Pear2' },
          { label: 'ACH950', value: 'Orange2' },
        ]} />
        <Divider orientation="left">Protocols</Divider>
        <Checkbox.Group defaultChecked={false} options={[
          { label: 'ModBus', value: 'Apple' },
          { label: 'OPC UA', value: 'Pear' },
          { label: 'Ethernet', value: 'Orange' },
        ]} />
        <Divider orientation="left">Data Points</Divider>
        <Slider max={50} min={1} range defaultValue={[4, 12]} />
        <Divider orientation="left">Average Rating</Divider>
        <Rate allowHalf style={{}} />
      </Sider>
      <Layout style={{ padding: '0 24px 24px', marginLeft: 400, marginRight: 100 }}>
        {this.state.loadClients ? <div className="example">
          <Spin size="large" />
        </div> :
          <Row gutter={32} justify="center">
            {this.state.apps.map((d) => (
              <Col span={12}>
                <Card style={{ marginTop: 16 }}
                  actions={[
                    <CloudDownloadOutlined key="download" />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]}>
                  <Card.Meta
                    avatar={<Avatar src={logo} />}
                    title={d.name}
                    description={<>
                      <Paragraph ><Text strong>endpoints</Text>: {d.endpoints.map(e => e + ", ")}<br />
                        <Text strong>drives</Text>: {d.drives.map(e => e + ", ")}</Paragraph >
                      <Rate disabled defaultValue={4} />
                    </>}
                  />
                </Card>
              </Col>
            ))}
          </Row>}
      </Layout>
    </Layout>)
  }
}
