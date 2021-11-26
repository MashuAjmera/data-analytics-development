import React, { Component } from "react";
import { Typography, Button, message, Form, Input, Row, Col, Statistic, Layout, Space } from "antd";
import { LoginOutlined,TeamOutlined,AppstoreOutlined,SolutionOutlined,LinkOutlined } from "@ant-design/icons";

export default class Configure extends Component {
  state = { loading: false };

  onFinish = (values) => {
    this.setState({ loading: true });
    fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        this.props.setLogin(data);
        this.setState({ loading: false });
        message.success("Logged In Successfully!");
      })
      .catch((error) => message.warning({ content: error }));
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { Title } = Typography;

    return (
    <Layout>
    <Row gutter={16}>
      <Col span={8} style={{padding:"100px 160px"}}>
        <Space direction="vertical" size="large">
        <Statistic title="Customers" value={"4000+"} prefix={<TeamOutlined />}/>
        <Statistic title="Apps" value={"2 Million+"} prefix={<AppstoreOutlined />} />
        <Statistic title="Vendors" value={"300K+"} prefix={<SolutionOutlined />} />
        <Statistic title="Drives" value={"400+"} prefix={<LinkOutlined />} />
        </Space>
      </Col>
      <Col span={16} style={{padding:"170px 0px"}}>
      <Title level={2} style={{ textAlign: "center" }}>SignIn to Continue</Title>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" loading={this.state.loading} icon={<LoginOutlined />}>
            Login
          </Button>
        </Form.Item>
      </Form>
      </Col>
      </Row>
      </Layout>
    );
  }
}
