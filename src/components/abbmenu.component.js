import React, { Component } from "react";
import { Typography, Menu, Divider } from "antd";
import {
  AppstoreOutlined,
  LinkOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import logo from "../static/logo.png";

export default class ABBMenu extends Component {
  state = { current: "3" };

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  render() {
    const { Title } = Typography;
    return (
      <Menu
        theme="dark"
        onClick={this.handleClick}
        mode="horizontal"
        selectedKeys={[this.state.current]}
      >
        <Menu.Item key="1" disabled>
          <img className="logo" src={logo} alt="ABB logo" />
        </Menu.Item>
        <Menu.Item key="2" disabled>
          <Title
            level={2}
            style={{
              color: "#dddddd",
              width: "60vw",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Drive Data Centric App Toolkit
          </Title>
        </Menu.Item>
        {this.props.login && (
          <>
            <Menu.Item key="3" icon={<AppstoreOutlined />}>
              Clients
            </Menu.Item>
            <Menu.Item key="4" icon={<ApartmentOutlined />}>
              Harmonize
            </Menu.Item>
            <Menu.Item key="5" icon={<LinkOutlined />}>
              Drives
            </Menu.Item>
            <Menu.Item key="6" onClick={this.props.logOut}>
              <Divider
                type="vertical"
                style={{
                  borderLeftColor: "rgb(217, 34, 34)",
                  height: "2em",
                  marginRight: "11px",
                }}
              />
              LogOut
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  }
}
