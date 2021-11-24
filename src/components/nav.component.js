import React, { Component } from "react";
import { Typography, Menu, Divider } from "antd";
import {Link } from "react-router-dom";
import {
  AppstoreOutlined,
  LinkOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import logo from "../static/logo.png";

export default class Nav extends Component {
  state = { current: null};

  componentDidMount(){
      const y=window.location.pathname.split('/');
      this.setState({current:y[1]});
  }

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
        <Menu.Item key="1">
          <img className="logo" src={logo} alt="ABB logo" />
        </Menu.Item>
        <Menu.Item key="2">
          <Title
            level={2}
            style={{
              color: "#dddddd",
              width: "calc(100vw - 750px)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Drive Data Centric App Toolkit
          </Title>
        </Menu.Item>
        {this.props.login && (
          <>
            <Menu.Item key="" icon={<AppstoreOutlined />}>
              <Link to="/">Clients</Link>
            </Menu.Item>
            <Menu.Item key="harmonize" icon={<ApartmentOutlined />}>
              
              <Link to="/harmonize">Harmonize</Link>
            </Menu.Item>
            <Menu.Item key="drives" icon={<LinkOutlined />}>
              
              <Link to="/drives">Drives</Link>
            </Menu.Item>
            <Menu.Item key="6" onClick={this.props.logOut}>
              <Divider
                type="vertical"
                style={{
                  borderLeftColor: "#f5222d",
                  height: "2em",
                  marginRight: "11px",
                }}
              />
              Log Out
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  }
}
