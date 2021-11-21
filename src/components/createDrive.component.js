import React, { Component } from "react";
import {
  Form, Select,Button, Upload, message, Typography
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
export default class CreateDrive extends Component {
  state={protocols:[{"id":"1234","name":"Modbus"},{"id":"5678","name":"OpcUA"}]}

  render() {
    const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
    <Title style={{ textAlign: "center" }}>Create your Virtual Drive</Title>
      <Form.Item
        label="Parameter File"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Upload {...props}>
    <Button icon={<UploadOutlined />}>Upload JSON</Button>
  </Upload>
      </Form.Item>

      <Form.Item
        label="Protocols"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
      <Select
        showSearch
        placeholder={`Select Protocols to Add`}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={this.handleChange}
      >
        {this.state.protocols.map((section) => (
          <Select.Option key={section.id} value={section.id}>
            {section.name}
          </Select.Option>
        ))}
      </Select>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Create Drive
        </Button>
      </Form.Item>
    </Form>
    );
  }
}
