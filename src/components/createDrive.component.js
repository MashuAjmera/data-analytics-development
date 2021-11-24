import React, { Component } from "react";
import { Form, Select, Button, Upload, message, Typography, Input,PageHeader } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import DataPoints from "./dataPoints.component";
export default class CreateDrive extends Component {
  state = {
    count:1,
    protocols: [],
    parameters:[],
    selectedItems: [],
    loadProtocols:false
  };
  componentDidMount(){
    const token = localStorage.getItem("Authorization");
    if(token){
      this.setState({loadProtocols:true});
      // FETCH name of all the drives GET /api/drives
      fetch("/api/protocols/", {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadProtocols: false, protocols: data.protocols });
        })
        .catch((error) => message.warning({ content: error }));
  }
}

  handleChange = (selectedItems) => {
    this.setState({ selectedItems });
  };

  handleAdd = () => {
    const { count, parameters } = this.state;
    const newParameter = {
      key: count,
      _id: count,
      name: `Parameter ${count}`,
      unit: 'Nm',
    };
    this.setState({
      parameters: [...parameters, newParameter],
      count: count + 1,
    });
  };

  render() {
    const columns = [
      {
        title: "ParamId",
        dataIndex: "_id",
        editable: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "Unit",
        dataIndex: "unit",
        editable: true,
      },
    ];

    const onFinish = (values) => {
      let x={
        name:values.name,
        protocols: this.state.selectedItems,
        parameters: this.state.parameters
      }
      console.log("Success:", x);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    const props = {
      name: "file",
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {
        authorization: "authorization-text",
      },
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const { Title } = Typography;
    const { selectedItems } = this.state;
    const filteredOptions = this.state.protocols.filter(
      (protocol) => !selectedItems.includes(protocol)
    );

    return (
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

<PageHeader
          className="site-page-header"
          title={<Title level={2}>Create Virtual Drive</Title>}
          extra={[
            <Button type="primary" htmlType="submit">
              Create Drive
            </Button>,
          ]}
        />
        {/* <Title level={2} style={{ textAlign: "center" }}>Create your Virtual Drive</Title> */}
        {/* <Form.Item
          label="Parameter File"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload JSON</Button>
          </Upload>
        </Form.Item> */}

        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input placeholder="Enter virtual drive name"/>
        </Form.Item>
        <Form.Item
          label="Protocols"
          name="protocols"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Select
            mode="multiple"
            value={selectedItems.map(p=>p.name)}
            showSearch
            placeholder={`Select Protocols to Add`}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.handleChange}
          >
            {filteredOptions.map((section) => (
              <Select.Option key={section._id} value={section._id}>
                {section.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Parameters"
          name="parameters"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >

        <Button
         icon={<UploadOutlined />}
          onClick={this.handleAdd}
          style={{
            marginBottom: 16,
          }}
        >
          Add a Parameter
        </Button>
        <DataPoints
          columns={columns}
          handleClick={this.handleClick}
          dataSource={this.state.parameters}
        />
        </Form.Item>
      </Form>
    );
  }
}
