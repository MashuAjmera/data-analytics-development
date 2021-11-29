import React, { Component } from "react";
import { message, Row, Col, Typography, Empty,PageHeader, Button } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import Drives from "./drives.component";
import DataPoints from "./dataPoints.component";

export default class Harmonize extends Component {
  state = { drive: null,empty:true, loadApprove:false };

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

  handleApprove=()=>{
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ loadApprove:true});
      fetch(`/api/drives/getapproval/${this.state.drive._id}`, {
        headers: { Authorization: token },
        method:"PUT"
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadApprove:false });
          message.success(`Drive ${this.state.drive.name} Approved.`)
        })
        .catch((error) => message.warning({ content: error }));
      }
  }

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
        title: "Alias (Synthetic) Name",
        dataIndex: "Alias",
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
              style={{ padding: 24, backgroundColor: "white", height: "32rem" }}
            >
            <PageHeader
              className="site-page-header"
              title={<Typography.Title level={4}>Select Drive to Review</Typography.Title>}
            />
            {/* <Typography.Title level={4}>          Select Drive to Review       </Typography.Title> */}
              <Drives handleClick={this.handleClick} />
            </div>
          </Col>
          <Col span={18}>
            <div
              className="site-layout-background"
              style={{ padding: 24, backgroundColor: "white", height: "32rem" }}
            >
            {this.state.empty ?
          <Empty description={<span>No drive selected yet!</span>} style={{marginTop:"10rem"}}/> : <>
          {/* <Typography.Title level={4}> Edit required name</Typography.Title> */}
              
        <PageHeader
          className="site-page-header"
          title={<Typography.Title level={4}>Edit required name</Typography.Title>}
          extra={[
            <Button type="primary" loading={this.state.loadApprove} icon={<LikeOutlined />} onClick={this.handleApprove}>
              Approve
            </Button>,
          ]}
        />
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
