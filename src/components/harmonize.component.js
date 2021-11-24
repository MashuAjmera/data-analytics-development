import React, { Component } from "react";
import { message, Row, Col } from "antd";
import Drives from "./drives.component";
import DataPoints from "./dataPoints.component";

export default class Harmonize extends Component {
  state = {
    loadNext: false,
    drive: null,
  };

  handleClick = (id) => {
    this.setState({ loadNext: true});
    const token = localStorage.getItem("Authorization");
    if (token) {
    fetch(`/api/drives/${id}`, {
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ drive: data.drive, loadNext: false });
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
    }
  };

  render() {

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        editable: true,
      },
      {
        title: "Unit",
        dataIndex: "unit",
      },
    ];

    return (
      <Row gutter={16}>
        <Col span={6}>
          <Drives handleClick={this.handleClick}/>
        </Col>
        <Col span={18}>
          <DataPoints columns={columns} dataSource={this.state.drive && this.state.drive.parameters}/>
        </Col>
      </Row>
    );
  }
}
