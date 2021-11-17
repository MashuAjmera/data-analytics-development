import React, { Component } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default class AddEndpoint extends Component {
  state = { driveModel: false };

  componentDidMount() {}

  changeDriveModal = () => {
    this.setState({ driveModal: !this.state.driveModal });
  };

  render() {
    return (
      <>
        <Modal
          title="Add Endpoint"
          visible={this.state.driveModal}
          onOk={this.changeDriveModal}
          onCancel={this.changeDriveModal}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
            <Button icon={<PlusOutlined />} onClick={this.changeDriveModal}>
            Add An Existing Endpoint
          </Button>
      </>
    );
  }
}
