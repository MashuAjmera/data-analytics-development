import React, { Component } from "react";
import { Button, Typography, message, Layout, Menu } from 'antd';
import logo from './static/logo.png';
import Login from './components/login.component';
import Clients from './components/clients.component';
// import 'antd/dist/antd.css';
import './static/antd.css';
import './App.css';

export default class App extends Component {
  state = { status: 0, info: {}, current: 0, login: false, user: [] };

  componentDidMount() {
  }

  logOut = (e) => {
    localStorage.removeItem("Authorization");
    this.setState({ user: [], login:false });
    window.location.reload();
    message.success({ content: "Logged Out Successfully!" });
  };

  setLogin = admin => {
    this.setState({ login: !this.state.login, user: { admin } });
  }

  render() {
    const { Header, Footer, Content } = Layout;
    const { Title } = Typography;

    return (
      <Layout>
        <Header style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
          <div className="logo" >
            <img src={logo} alt="ABB Logo" />
          </div>
          {this.state.login && <Menu theme="dark">
            <Menu.Item key="1"><Button onClick={this.logOut} type="text" danger>LOGOUT</Button></Menu.Item>
          </Menu>}
        </Header>
        <Content style={{ padding: '50px 50px 0px 50px', minHeight: "calc(100vh - 20.5vh)" }}>
            <Title style={{ textAlign: "center" }}>Drive Data Centric App Toolkit</Title>
            {this.state.login ? <Clients /> : <Login setLogin={this.setLogin} /> }
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2021 ABB Ltd.</Footer>
      </Layout>
    );
  }
}