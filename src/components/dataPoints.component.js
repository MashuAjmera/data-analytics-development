import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Table, Input, Form, Tooltip, Spin, message, Empty } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
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
      console.log("Save failed:", errInfo);
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
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          suffix={
            <Tooltip title="Press Enter to Save">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
      </Form.Item>
    ) : (
      <Tooltip
        title="Click to Change"
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </Tooltip>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default class DataPoints extends Component {
  state = {
    driveModal: false,
    loadNext: false,
    drive: null,
    protocol: null,
    rule: "",
    code: `# Modify code below\ndef rule(drive): \n\treturn drive.parameters}`,
  };

  handleSave = (row) => {
    const index = this.props.dataSource.findIndex((item) => row._id === item._id);
    const item = this.props.dataSource[index];
    const key = 'updatable';
    message.loading({ content: 'Sending Request...', key, duration: 10 });
    var which;
    if (row.name !== item.name) {which="name"}
    else if (row.interval !== item.interval) { which="interval" }
    const token = localStorage.getItem("Authorization");
    if(token){
      fetch(`/api/drives/${this.props._id}/parameters/${row._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ [which]: row[which] })
      }).then(response => response.json())
      .then((data) => {
        this.props.handleClick(this.props._id);
        message.success({ content: "successfully updated", key });
      })
        .catch(error => message.warning({ content: error, key }));
    }
  };

  render() {
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

    return this.props.dataSource ? (
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            locale={{emptyText:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Parameter" />}}
            rowSelection={this.props.rowSelection}
            columns={columns2}
            dataSource={this.props.dataSource.map(data=>{data.key=data._id; return data;})}
            pagination={false}
            scroll={{ y: "26em" }}
          />
        ) : (
          <div className="example">
          <Spin size="large" />
        </div>
        )
  }
}
