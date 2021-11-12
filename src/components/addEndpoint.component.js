import React, { Component } from "react";
import { Card, Modal } from "antd";

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
        <Card
          size="small"
          style={{
            width: 300,
            background: "#f0f2f5",
            border: "1px dashed red",
          }}
          onClick={this.changeDriveModal}
        >
          Add
        </Card>
      </>
    );
  }
}
