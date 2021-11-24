import React, { Component } from "react";
import { Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default class Element extends Component {
  state = { name: null };

  componentDidMount() {
    // fetch('/api/endpoints/'+this.props.endpoint.id) GET /api/endpoints/<id>
    // .then(data=>this.setState({"name":data.name}))
    // .catch(error=>console.log(error))
    this.setState({ name: "MQTT" });
  }

  render() {
    const genExtra = () => (
      <DeleteOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    );
    return (
      <Card
        size="small"
        title={this.state.name}
        extra={genExtra()}
        style={{
          width: 300,
          boxShadow: "0px 0px 4px #cccccc",
          background: "#f0f2f5",
        }}
        bordered={false}
      >
        {this.props.properties.map((property) => (
          <p key={property.id}>
            {property.id}: {property.value}
          </p>
        ))}
      </Card>
    );
  }
}
