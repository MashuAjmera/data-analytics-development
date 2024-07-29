import React, { Component } from "react";
import { Typography, Menu } from "antd";
import {Link } from "react-router-dom";
import {
  UserOutlined,
  AppstoreOutlined,
  LinkOutlined,
  ApartmentOutlined,
  DropboxOutlined,LogoutOutlined,
  CrownOutlined
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
    const { SubMenu } = Menu;

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
              width: "calc(100vw - 900px)",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
           Data Flow App Development Toolkit
          </Title>
        </Menu.Item>
        {this.props.login && (
          <>
            <Menu.Item key="" icon={<AppstoreOutlined />}>
              <Link to="/">App Gallery</Link>
            </Menu.Item>
            {['admin','developer'].indexOf(this.props.type) !== -1 && <Menu.Item key="develop" icon={<DropboxOutlined />}>
              <Link to="/develop">Develop</Link>
            </Menu.Item>}
            {['admin','governer'].indexOf(this.props.type) !== -1 && <Menu.Item key="harmonize" icon={<ApartmentOutlined />}>
              
              <Link to="/harmonize">Harmonize</Link>
            </Menu.Item>}
            {['admin','onboarder'].indexOf(this.props.type) !== -1 && <Menu.Item key="drives" icon={<LinkOutlined />}>
              <Link to="/drives">Onboard</Link>
            </Menu.Item>}
            <SubMenu key="user" icon={<UserOutlined />} title="Profile">
            <Menu.Item key="5" icon={<CrownOutlined />}>{this.props.type} account</Menu.Item>
            <Menu.Item key="6" onClick={this.props.logOut} icon={<LogoutOutlined />}>
              logout
            </Menu.Item>
        </SubMenu>
          </>
        )}
      </Menu>
    );
  }
}
