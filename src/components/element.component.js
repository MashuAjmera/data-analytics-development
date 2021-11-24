import React, { Component } from "react";
import { Card, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default class Element extends Component {
  render() {
    const genExtra = () => (
      <DeleteOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          const token = localStorage.getItem("Authorization");
          if (token) {
            fetch(
              `/api/clients/${this.props.clientId}/delete${this.props.ename}/${this.props.element._id}`,
              {
                headers: { Authorization: token },
                method: "DELETE",
              }
            )
              .then((response) => response.json())
              .then((data) => {
                message.success(`${this.props.ename} deleted successfully.`)
                this.props.setClient(data);
              })
              .catch((error) => console.log(error));
          }
        }}
      />
    );
    return (
      <Card
        size="small"
        title={this.props.element.name}
        extra={genExtra()}
        style={{
          width: 300,
          boxShadow: "0px 0px 4px #cccccc",
          background: "#f0f2f5",
        }}
        bordered={false}
      >
        {this.props.element.properties.map((property) => (
          <p key={property._id}>
            {property.name}: {property.value}
          </p>
        ))}
      </Card>
    );
  }
}
