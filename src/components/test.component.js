import React, { Component } from "react";
import { Button, Modal, Form, Radio } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Rules from './rules.component'

export default class Test extends Component {
  state = {
    modal: false,
    loadButton: false,
  };

  changeDriveModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  onOk = (values) => {
    this.setState({ loadButton: true });
  };

  onCancel = () => {
    this.changeDriveModal();
    this.setState({ endpoint: null,loadButton: false });
  };

  render() {
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return (
      <>
        <Modal
          title="Test App"
          visible={this.state.modal}
          onOk={this.onOk}
          onCancel={this.onCancel}
          footer={[
            <Button onClick={this.onCancel}>Cancel</Button>,
            <Button
              form="test"
              key="submit"
              htmlType="submit"
              type="primary"
              loading={this.state.loadButton}
            >
              Run Virtual Drive
            </Button>,
          ]}
        >
          <Form
            name="test"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onOk}
            labelCol={{ span: 4 }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Endpoint"
              name="endpoint"
            >
              <Radio.Group buttonStyle="solid">
                {this.props.endpoints.map((section) => (
                  <Radio.Button key={section._id} value={section._id}>{section.name}</Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Drive"
              name="drive"
            >
            <Radio.Group buttonStyle="solid">
              {this.props.drives.map((section) => (
                <Radio.Button key={section._id} value={section._id}>{section.name}</Radio.Button>
              ))}
            </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Dataset"
              name="dataset"
            >
              <Radio.Group buttonStyle="solid">
                  <Radio.Button key="anomaly" value="anomaly">
                  anomaly</Radio.Button>
                  <Radio.Button key="ideal" value="ideal">
                  ideal</Radio.Button>
                  <Radio.Button key="random" value="random">
                  random</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Rule"
              name="rule"
            >
              <Rules/>
            </Form.Item>
          </Form>
        </Modal>
        <Button icon={<PlusOutlined />} type="dashed" onClick={this.changeDriveModal}>
          Test with Virtual Drive
        </Button>
      </>
    );
  }
}
