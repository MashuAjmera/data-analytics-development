import React, { Component } from "react";
import { Typography, Button, message, Form, Input } from "antd";
import { LoginOutlined } from "@ant-design/icons";

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
        <Title level={2} style={{ textAlign: "center" }}>SignIn to Continue</Title>
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
    );
  }
}
