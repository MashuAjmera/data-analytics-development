import React, { Component } from "react";
import { Form, Select, Button, message, Typography, Input, PageHeader, Space } from "antd";
import { UploadOutlined, ApiOutlined } from "@ant-design/icons";
import DataPoints from "./dataPoints.component";
export default class CreateDrive extends Component {
  state = {
    count: 1,
    protocols: [],
    loadButton:false,
    parameters: [],
    selectedItems: [],
    loadProtocols: false
  };
  componentDidMount() {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ loadProtocols: true });
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
    const { count } = this.state;
    const newParameter = {
      key: count,
      _id: count,
      name: `Parameter ${count}`,
      unit: 'Nm',
    };
    this.setState({
      parameters: [...this.state.parameters, newParameter],
      count: count + 1,
    });
  };

  handleFile = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      this.setState({parameters:JSON.parse(e.target.result)})
    };
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
        title: "Alias",
        dataIndex: "Alias",
        editable: true,
      },
      {
        title: "Unit",
        dataIndex: "unit",
        editable: true,
      },
    ];

    const onFinish = (values) => {
      const token = localStorage.getItem("Authorization");
      if (token) {
        this.setState({ loadButton: true });
        let x = {
          name: values.name,
          protocols: this.state.selectedItems.map(item=>({_id:item})),
          parameters: this.state.parameters
        }
        fetch("/api/drives/createdrive", {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify(x),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            this.setState({ loadButton: false });
            message.success("Drive Created Successfully!");
          })
          .catch((error) => message.warning({ content: error }));
      }
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
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
          span: 6,
        }}
        wrapperCol={{
          span: 12,
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
            <Button type="primary" htmlType="submit" loading={this.state.loadButton} icon={<ApiOutlined />}>
              Create Drive
            </Button>,
          ]}
        />

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
          <Input placeholder="Enter virtual drive name" />
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
            value={selectedItems.map(p => p.name)}
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
        >
          <Space>
            <Button
              icon={<UploadOutlined />}
              onClick={this.handleAdd}
              danger
              style={{
                marginBottom: 16,
              }}
            >
              Add a Parameter
            </Button>
            {/* <Upload {...props}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload> */}
            <input type="file" onChange={this.handleFile} id="image_uploads" name="image_uploads" style={{marginTop:"-17px"}} />
          </Space>
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
