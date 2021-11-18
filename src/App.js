import React, { Component } from "react";
import { Typography, message, Layout, } from "antd";
import Login from "./components/login.component";
import Clients from "./components/clients.component";
import ABBMenu from "./components/abbmenu.component";
// import 'antd/dist/antd.css';
import "./static/antd.css";
import "./App.css";

export default class App extends Component {
  state = { current: '3', login: false, user: [] };

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
    return (
      <Layout>
        <Header>
          <ABBMenu login={this.state.login} logOut={this.logOut}/>
        </Header>
        <Content
          style={{
            padding: "50px 50px 0px 50px",
            minHeight: "calc(100vh - 15.9vh)",
          }}
        >
          {this.state.login ? (
            <Clients user={this.state.user} />
          ) : (
            <>
              <Title style={{ textAlign: "center" }}>SignIn to Continue</Title>
              <Login setLogin={this.setLogin} />
            </>
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>© 2021 ABB Ltd.</Footer>
      </Layout>
    );
  }
}
