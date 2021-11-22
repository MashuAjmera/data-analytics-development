import React, { Component } from "react";
import { Modal, Steps, List, Button, Table, Space, Input, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sections from "./sections.component";
import CodeEditor from '@uiw/react-textarea-code-editor';

export default class AddDrive extends Component {
  state = {
    driveModal: false,
    token:null,
    current: 0,
    drives: [],
    loadNext:false,
    drive: null,
    protocol: null,
    rule:'',
    selectedRowKeys: [], code:`# Modify code below\ndef rule(drive): \n\treturn drive.parameters}`
  };

  componentDidMount() {
    const token =localStorage.getItem("Authorization");
    this.setState({ token }, ()=>
    // FETCH name of all the drives GET /api/drives
    fetch("/api/drives/", {
      headers: { Authorization: this.state.token },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ loadClients: false, drives: data.drives });
      })
      .catch((error) => message.warning({ content: error })));
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

  handleClick = (id) => {
    this.setState({loadNext:true, current: 1})
    fetch(`/api/drives/${id}`, {
      headers: { Authorization: this.state.token },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drive: data.drive, loadNext:false });
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
    this.setState({ rule:value });
  };

  render() {
    const { selectedRowKeys } = this.state;
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
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Interval",
        dataIndex: "interval",
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { Step } = Steps;
    const steps = [
      {
        title: "Drive",
        content: <List
            size="small"
            dataSource={this.state.drives}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <Button onClick={() => this.handleClick(item._id)} type="text">
                  {item.name}
                </Button>
              </List.Item>
            )}
            />,
      },
      {
        title: "Protocol",
        content: this.state.loadNext ? <div className="example"><Spin size="large" /></div> : this.state.drive && (
          <Sections sections={this.state.drive.protocols} sname="protocols" />
        ),
      },
      {
        title: "Data Points",
        content: this.state.drive && (
          <Space direction="vertical">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.drive.parameters}
              pagination={false}
              scroll={{ y: 240 }}
            />
            <span style={{ marginLeft: 8 }}>
              {hasSelected
                ? `Selected ${selectedRowKeys.length} data points`
                : ""}
            </span>
          </Space>
        ),
      },
      {
        title: "Rules",
        content: 
        <CodeEditor
    value={this.state.code}
    language="py"
    placeholder="Please enter PY code."
    onChange={(evn) => this.setState({code: evn.target.value})}
    padding={15}
    style={{
      fontSize: 12,
      backgroundColor: "#f5f5f5",
      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
    }}
  />
      //   <Input.TextArea
      //   value={this.state.rule}
      //   onChange={this.onChange}
      //   placeholder="Write rules to modify data"
      //   autoSize={{ minRows: 3, maxRows: 5 }}
      // />,
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
          okText="Add"
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
          Add Drive
        </Button>
      </>
    );
  }
}
