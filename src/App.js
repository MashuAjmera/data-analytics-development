import React, { Component } from "react";
import { Button, message, Typography, Layout, Menu } from 'antd';
import logo from './static/logo.png';
import Login from './components/login.component';
// import 'antd/dist/antd.css';
import './static/antd.css';
import './App.css';

export default class App extends Component {
  state = { status: 0, info: {}, current: 0, login: false, user: [] };

  componentDidMount() {
    let token = localStorage.getItem("Authorization");
    if(token){
      fetch('/api/checkuser', {
        headers: { "Authorization": token },
      })
        .then(response => response.json())
        .then((data) => {
          if(data.code===2){
            this.setLogin(data.admin);
          }
        }).catch(error => message.warning({ content: error }));
    }
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
        <Content style={{ padding: '50px 50px 0px 50px', minHeight: "calc(100vh - 21vh)" }}>
          <div className="site-layout-content">
            <Title style={{ textAlign: "center" }}>Drive Data Centril App Tool</Title>
            {this.state.login ?
              <>
                hi user
              </> : <Login setLogin={this.setLogin} />
            }
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2021 ABB Ltd.</Footer>
      </Layout>
    );
  }
}