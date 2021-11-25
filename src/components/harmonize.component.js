import React, { Component } from "react";
import { message, Row, Col, Typography, Empty } from "antd";
import Drives from "./drives.component";
import DataPoints from "./dataPoints.component";

export default class Harmonize extends Component {
  state = { drive: null,empty:true };

  handleClick = (_id) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ empty:false});
      fetch(`/api/drives/${_id}`, {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ drive: data.drive });
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
        title: "ParamId",
        dataIndex: "_id",
      },
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
      <>
        <Typography.Title level={2} style={{ textAlign: "center" }}>
          Harmonize Drive Parameters
        </Typography.Title>
        <Row gutter={16}>
          <Col span={6}>
            <div
              className="site-layout-background"
              style={{ padding: 24, backgroundColor: "white", height: "37rem" }}
            >
            <Typography.Title level={4}>          Select a Drive        </Typography.Title>
              <Drives handleClick={this.handleClick} />
            </div>
          </Col>
          <Col span={18}>
            <div
              className="site-layout-background"
              style={{ padding: 24, backgroundColor: "white", height: "37rem" }}
            >
            {this.state.empty ?
          <Empty description={<span>No drive selected yet!</span>} style={{marginTop:"10rem"}}/> : <><Typography.Title level={4}> Edit required name</Typography.Title>
              <DataPoints
                columns={columns}
                handleClick={this.handleClick}
                _id={this.state.drive && this.state.drive._id}
                dataSource={this.state.drive && this.state.drive.parameters}
              /></>}
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
