import React, { Component } from "react";
import { Select, Form, Input, Spin , message} from "antd";

export default class Sections extends Component {
  state = { section: null, load: false };

  handleChange = (id) => {
    const token = localStorage.getItem("Authorization");
    if(token){
      this.setState({ load: true });
      // FETCH GET /api/${this.props.sname}/id <- get all properties of endpoint
      fetch(`/api/${this.props.sname}/${id}`, {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ section: data,current:1, load:false });
        })
        .catch((error) => message.warning({ content: error }));
    }
    // this.setState({
    //   section: {
    //     name: "hi",
    //     properties: [
    //       { name: "IP", required: true, type: "integer" },
    //       { name: "PORT", required: true, type: "integer" },
    //     ],
    //   },
    // });
    // this.setState({ load: false });
  };

  render() {
    return this.props.sections ?<>
          <Form.Item
            label={this.props.sname}
            name="id"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder={`Select one of the ${this.props.sname} to add`}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.handleChange}
            >
              {this.props.sections.map((section) => (
                <Select.Option key={section._id} value={section._id}>
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
                key={property.name}
                name={property._id}
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
        </>:
      <div className="example">
        <Spin size="large" />
      </div>
  }
}
