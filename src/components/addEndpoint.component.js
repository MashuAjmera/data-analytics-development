import React, { Component } from "react";
import { Button, Modal, Select, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default class AddEndpoint extends Component {
  state = { modal: false, endpoints: [], endpoint: null };

  componentDidMount() {
    // FETCH GET /api/endpoints <- name and id of all endpoints
    this.setState({
      endpoints: [
        { id: "123", name: "hello" },
        { id: "456", name: "hey" },
      ],
    });
  }

  changeDriveModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  onCancel=()=>{
    this.changeDriveModal();
    this.setState({endpoint:null});
  }

  handleChange = (id) => {
    console.log(id);
    // FETCH GET /api/endpoint/id <- get all properties of endpoint
    this.setState({
      endpoint: {
        name: "hi",
        properties: [{ name: "IP", required: true, type: "integer" }],
      },
    });
  };

  render() {
    const onFinish = (values) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return (
      <>
        <Modal
          title="Add Endpoint"
          visible={this.state.modal}
          onOk={this.changeDriveModal}
          okText="Add"
          onCancel={this.onCancel}
        >
          <Select
            showSearch
            placeholder="Select"
            style={{ width: "100%" }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.handleChange}
          >
            {this.state.endpoints.map((org) => (
              <Select.Option key={org.id} value={org.id}>
                {org.name}
              </Select.Option>
            ))}
          </Select>
          {this.state.endpoint && (
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              {this.state.endpoint.properties.map((property) => (
                <Form.Item
                  label={property.name}
                  name={property.name}
                  rules={[
                    {
                      required: property.required,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ))}
            </Form>
          )}
        </Modal>
        <Button icon={<PlusOutlined />} onClick={this.changeDriveModal}>
          Add Endpoint
        </Button>
      </>
    );
  }
}
