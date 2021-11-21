import React, { Component } from "react";
import { Typography, Button, message, Form, Input} from 'antd';

export default class Configure extends Component {
  state={loading:false}

  onFinish = (values) => {
    this.setState({loading:true});
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    }).then(response => response.json())
      .then(data => {
        if(data.code===2){
          localStorage.setItem("Authorization", data.token);
          this.props.setLogin(data.admin);
          this.setState({loading:false});
          message.success(data.message);
        } else message.warning({content: data.message});
      })
      .catch(error => message.warning({ content: error }));
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
      <Title style={{ textAlign: "center" }}>SignIn to Continue</Title>
        <Form.Item
          label="Username"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
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
              message: 'Please input your password!',
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
          <Button type="primary" htmlType="submit" loading={this.state.loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  }
}