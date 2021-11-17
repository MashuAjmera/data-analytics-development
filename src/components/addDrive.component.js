import React, { Component } from "react";
import { Modal, Steps, List, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default class AddDrive extends Component {
  state = { driveModel: false, current: 0, drives: [], drive: null };

  componentDidMount() {
    // FETCH name of all the drives GET /api/drives
    this.setState({ drives: ["ACS880", "ACC800"] });
  }

  changeDriveModal = () => {
    this.setState({ driveModal: !this.state.driveModal, current: 0 });
  };

  loadProtocols = () => {
    // FETCH protocols supported by selected drive id
    // this.setState({})
  };

  changeCurrent = (current) => {
    this.setState({ current });
  };

  render() {
    const { Step } = Steps;
    const steps = [
      {
        title: "Drive",
        content: (
          <List
            size="small"
            dataSource={this.state.drives}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        ),
      },
      {
        title: "Protocol",
        content: "h3i",
      },
      {
        title: "Data Points",
        content: "h4i",
      },
    ];
    return (
      <>
        <Modal
          title="Add Drive"
          visible={this.state.driveModal}
          onOk={this.changeDriveModal}
          onCancel={this.changeDriveModal}
        >
          <Steps current={this.state.current} onChange={this.changeCurrent}>
            {steps.map((item) => (
              <Step
                key={item.title}
                title={item.title}
                content={item.content}
              />
            ))}
          </Steps>
          <div className="steps-content">
            {steps[this.state.current].content}
          </div>
        </Modal>
        <Button icon={<PlusOutlined />} onClick={this.changeDriveModal}>
          Add An Existing Drive
        </Button>
      </>
    );
  }
}
