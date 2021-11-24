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
    const token = localStorage.getItem("Authorization");
    if(token){
      fetch('/api/users/checkuser', {
        headers: { "Authorization": token },
      })
        .then(response => {
          if(response.ok){
            return response.json();
          }else {
            throw new Error("Something went wrong");
          }
        }).then(data=>this.setLogin(data))
        .catch(error => message.warning({ content: error }));
    }
  }

  logOut = (e) => {
    localStorage.removeItem("Authorization");
    this.setState({ user: {}, login: false });
    message.success({ content: "Logged Out Successfully!" });
  };

  setLogin = (data) => {
    localStorage.setItem("Authorization", data.token);
    this.setState({ login: true, user:{type:data.type}});
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
