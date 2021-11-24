import React, { Component, useContext, useState, useEffect, useRef  } from "react";
import { Modal, Steps, List, Button, Table, Space, Input, message, Spin, Form, Tooltip } from "antd";
import { PlusOutlined, InfoCircleOutlined  } from "@ant-design/icons";
import Sections from "./sections.component";
import CodeEditor from '@uiw/react-textarea-code-editor';
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} suffix={
          <Tooltip title="Press Enter to Save">
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
        } />
      </Form.Item>
    ) : (
      <Tooltip title="Click to Add"
        className="editable-cell-value-wrap"
        onClick={toggleEdit}>
        {children}
      </Tooltip>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

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
        title: "Interval",
        dataIndex: "interval",
        editable: true,
        render: (_, record) =><>Add Interval</>
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columns2 = columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
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
          components={components}
          rowClassName={() => 'editable-row'}
              rowSelection={rowSelection}
              columns={columns2}
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
        <Button icon={<PlusOutlined />}onClick={this.changeDriveModal}>
          Add Drive
        </Button>
      </>
    );
  }
}
