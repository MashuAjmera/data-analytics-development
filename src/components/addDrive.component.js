import React, { Component } from "react";
import { Card, Modal, Steps } from "antd";

export default class AddDrive extends Component {
  state = { driveModel: false, current: 0 };

  componentDidMount() {}

  changeDriveModal = () => {
    this.setState({ driveModal: !this.state.driveModal, current:0 });
  };

  changeCurrent = current => {
    this.setState({ current });
  };

  render() {
    const { Step } = Steps;
    const steps = [
      {
        title: 'Drive',
        content: <List
        size="small"
        bordered
        dataSource={[]}
        renderItem={item => <List.Item>{item}</List.Item>}
      />,
      },
      {
        title: 'Protocol',
        content: 'h3i',
      },
      {
        title: 'Data Points',
        content: 'h4i',
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
                  {steps.map(item => <Step key={item.title} title={item.title} content={item.content} />)}
                </Steps>
                <div className="steps-content">{steps[this.state.current].content}</div>
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
