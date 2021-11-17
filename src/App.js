import React, { Component } from "react";
import { Typography, message, Layout, Menu } from "antd";
import logo from "./static/logo.png";
import Login from "./components/login.component";
import Clients from "./components/clients.component";
// import 'antd/dist/antd.css';
import "./static/antd.css";
import "./App.css";

export default class App extends Component {
  state = { status: 0, info: {}, current: 0, login: false, user: [] };

  componentDidMount() {}

  logOut = (e) => {
    localStorage.removeItem("Authorization");
    this.setState({ user: [], login: false });
    window.location.reload();
    message.success({ content: "Logged Out Successfully!" });
  };

  setLogin = (admin) => {
    this.setState({ login: !this.state.login, user: { admin } });
  };

  render() {
    const { Header, Footer, Content } = Layout;
    const { Title } = Typography;
    const { SubMenu } = Menu;
    return (
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <img className="logo" src={logo} alt="ABB logo" />
            </Menu.Item>
            <Menu.Item key="2">Drive Data Centric App Toolkit</Menu.Item>
            <Menu.Item key="3">Navigation One</Menu.Item>
            <Menu.Item key="4" disabled>
              Navigation Two
            </Menu.Item>
            {this.state.login && (
              <Menu.Item key="alipay" onClick={this.logOut}>
                LogOut
              </Menu.Item>
            )}
          </Menu>
        </Header>
        <Content
          style={{
            padding: "50px 50px 0px 50px",
            minHeight: "calc(100vh - 15.9vh)",
          }}
        >
          <Title style={{ textAlign: "center" }}>
            Drive Data Centric App Toolkit
          </Title>
          {this.state.login ? (
            <Clients user={this.state.user} />
          ) : (
            <Login setLogin={this.setLogin} />
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>©2021 ABB Ltd.</Footer>
      </Layout>
    );
  }
}
