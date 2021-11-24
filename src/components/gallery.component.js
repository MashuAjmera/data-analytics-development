import React, { Component } from "react";
import { Card, Col, Row, Avatar, Rate } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class AppGallery extends Component {
  render() {
    const data = [
        {
          avatar: <SmileOutlined />,
          title: "ABB Client",
          description: (
            <>
              <p>endpoints: modbus, opcua</p>
              <p>drives: ACS800</p>
              <Rate disabled defaultValue={4} />
            </>
          ),
        },
        {
          avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
          title: "ABB Client",
          description: (
            <>
              <p>endpoints: modbus, opcua</p>
              <p>drives: ACS800</p>
              <Rate disabled defaultValue={4} />
            </>
          ),
        },
        {
          avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
          title: "ABB Client",
          description: (
            <>
              <p>endpoints: modbus, opcua</p>
              <p>drives: ACS800</p>
              <Rate disabled defaultValue={4} />
            </>
          ),
        },
        {
          avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
          title: "ABB Client",
          description: (
            <>
              <p>endpoints: modbus, opcua</p>
              <p>drives: ACS800</p>
              <Rate disabled defaultValue={4} />
            </>
          ),
        },
    ];
    return (
      <div className="site-card-wrapper">
        <Row gutter={64}>
          {data.map((d) => (
            <Col span={6}>
              <Card style={{marginTop: 16 }}>
                <Card.Meta
                  avatar={d.avatar}
                  title={d.title}
                  description={d.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}
