import React, { Component } from "react";
import { Modal, Steps, Button, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CodeEditor from "@uiw/react-textarea-code-editor";
import Sections from "./sections.component";
import DataPoints from "./dataPoints.component";
import Drives from "./drives.component";

export default class AddDrive extends Component {
  state = {
    driveModal: false,
    token: null,
    current: 0,
    drives: [],
    drive: null,
    selectedRowKeys: [],
    code: `def rule(drive): \n\treturn drive.parameters}`,
  };

  componentDidMount() {
    const token = localStorage.getItem("Authorization");
    this.setState({ token }, () =>
      // FETCH name of all the drives GET /api/drives
      fetch("/api/drives/", {
        headers: { Authorization: this.state.token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadClients: false, drives: data.drives });
        })
        .catch((error) => message.warning({ content: error }))
    );
    // this.setState({
    //   drives: [
    //     { name: "ACS880", id: "1234" },
    //     { name: "ACS800", id: "56798" },
    //   ],
    // });
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

  handleClick = (_id) => {
    this.setState({ current: 1 });
    fetch(`/api/drives/${_id}`, {
      headers: { Authorization: this.state.token },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drive: data.drive });
      })
      .catch((error) => message.warning({ content: error }));
    // let data = [];
    // for (let i = 0; i < 46; i++) {
    //   data.push({
    //     key: i,
    //     name: `Analog Input ${i}`,
    //     unit: 'kmph',
    //     type: 'uint',
    //     interval: 1000,
    //   });
    // }
    // this.setState({
    //   drive: {
    //     name: "ACS880",
    //     id: "1234",
    //     protocols: [
    //       { id: "123", name: "ModBus" },
    //       { id: "456", name: "OPCUA" },
    //     ],
    //     parameters:data
    //   },
    //   current: 1,
    // });
  };

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onChange = ({ target: { value } }) => {
    this.setState({ code: value });
  };

  render() {
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Unit",
        dataIndex: "unit",
      },
      {
        title: "Interval",
        dataIndex: "interval",
        editable: true,
        render: (_, record) => <>Add Interval</>,
      },
    ];
    const { Step } = Steps;
    const steps = [
      {
        title: "Drive",
        content: <Drives handleClick={this.handleClick} />,
      },
      {
        title: "Protocol",
        content: (
          <Sections
            sections={this.state.drive && this.state.drive.protocols}
            sname="protocols"
          />
        ),
      },
      {
        title: "Data Points",
        content: (
          <DataPoints
            columns={columns}
            dataSource={this.state.drive && this.state.drive.parameters}
          />
        ),
      },
      {
        title: "Rules",
        content: (
          <>
            Modify the code below or{" "}
            <Button
              type="link"
              href="http://localhost:8000"
              target="_blank"
              size="small"
            >
              use GUI
            </Button>
            .
            <CodeEditor
              value={this.state.code}
              language="py"
              placeholder="Please enter PY code."
              onChange={(evn) => this.setState({ code: evn.target.value })}
              padding={15}
              style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
          </>
        ),
      },
    ];
    return (
      <>
        <Modal
          title="Add Drive"
          visible={this.state.driveModal}
          onOk={this.changeDriveModal}
          onCancel={this.changeDriveModal}
          width={700}
          footer={[
            <Button onClick={this.onCancel}> Cancel </Button>,
            this.state.current === 0 && (
              <Button type="primary">Select Drive</Button>
            ),
            this.state.current === 1 && <Button
              type="primary"
              onClick={() => this.changeCurrent(2)}
            >
              Next
            </Button>,
            this.state.current === 2 && <Button
              type="primary"
              onClick={() => this.changeCurrent(3)}
            >
              Next
            </Button>,
            this.state.current === 3 && (
              <Button
                form="drives"
                key="submit"
                htmlType="submit"
                type="primary"
                loading={this.state.loadButton}
              >
                Add
              </Button>
            ),
          ]}
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

        <Form
          name="drives"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onOk}
          labelCol={{ span: 4 }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="steps-content">
            {steps[this.state.current].content}
          </div>
          </Form>
        </Modal>
        <Button icon={<PlusOutlined />} onClick={this.changeDriveModal}>
          Add Drive
        </Button>
      </>
    );
  }
}
