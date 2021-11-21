import React, { Component } from "react";
import { Select, Form, Input, Spin } from "antd";

export default class Sections extends Component {
  state = { section: null, load: false };

  handleChange = (id) => {
    this.setState({ load: true });
    // FETCH GET /api/${this.props.sname}/id <- get all properties of endpoint
    this.setState({
      section: {
        name: "hi",
        properties: [
          { name: "IP", required: true, type: "integer" },
          { name: "PORT", required: true, type: "integer" },
        ],
      },
    });
    this.setState({ load: false });
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
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={this.props.sname}
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder={`Select ${this.props.sname} to Add`}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.handleChange}
            >
              {this.props.sections.map((section) => (
                <Select.Option key={section.id} value={section.id}>
                  {section.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {this.state.load ? (
            <div className="example">
              <Spin size="large" />
            </div>
          ) : (
            this.state.section && this.state.section.properties.map((property) => (
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
            ))
          )}
        </Form>
      </>
    );
  }
}
