import React, { Component } from "react";
import { message, Layout, } from "antd";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/login.component";
import Clients from "./components/clients.component";
import Harmonize from "./components/harmonize.component";
import CreateDrive from "./components/createDrive.component";
import Nav from "./components/nav.component";
// import 'antd/dist/antd.css';
import "./static/antd.css";
import "./App.css";

export default class App extends Component {
  state = { login: false, user: {} };

  componentDidMount() {
    let token = localStorage.getItem("Authorization");
    if(token){
      this.setState({user:{admin:true},login:true})
      // fetch('/api/users/checkuser', {
      //   headers: { "Authorization": token },
      // })
      //   .then(response => response.json())
      //   .then((data) => {
      //     if(data.code===2){
      //       this.setLogin(data.admin);
      //     }
      //   }).catch(error => message.warning({ content: error }));
    }
  }

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
    return (
      <BrowserRouter>
      <Layout>
        <Header>
          <Nav login={this.state.login} logOut={this.logOut}/>
        </Header>
        <Content
          style={{
            padding: "50px 50px 0px 50px",
            minHeight: "calc(100vh - 15.9vh)",
          }}
        >
          {this.state.login ? (
            <Switch>
              <Route path="/" exact render={(props) => (<Clients user={this.state.user} />)}/>
              <Route path="/harmonize" component={Harmonize} />
              <Route path="/drives" component={CreateDrive} />
              <Route component={"Overview"} />
            </Switch>
          ) : (
            <>
              <Login setLogin={this.setLogin} />
            </>
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>© 2021 ABB Ltd.</Footer>
      </Layout>
      </BrowserRouter>
    );
  }
}
