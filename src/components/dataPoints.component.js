import React, { Component, useContext, useState, useEffect, useRef  } from "react";
import { Table, Space, Input, Form, Tooltip, Empty } from "antd";
import {  InfoCircleOutlined  } from "@ant-design/icons";
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

export default class DataPoints extends Component {
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

  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onChange = ({ target: { value } }) => {
    this.setState({ rule:value });
  };

  render() {
    const { selectedRowKeys } = this.state;

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

    const columns2 = this.props.columns.map((col) => {
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
    
    return (
      <Space direction="vertical">
            {this.props.dataSource ? <Table
          components={components}
          rowClassName={() => 'editable-row'}
              rowSelection={rowSelection}
              columns={columns2}
              dataSource={this.props.dataSource}
              pagination={false}
              scroll={{ y: 240 }}
            />:<Empty description={<span>Please select a drive!</span>} />}
            <span style={{ marginLeft: 8 }}>
              {hasSelected
                ? `Selected ${selectedRowKeys.length} data points`
                : ""}
            </span>
          </Space>
    );
  }
}
