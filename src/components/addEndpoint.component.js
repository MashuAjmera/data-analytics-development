import React, { Component } from "react";
import { Button, Modal, message  } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sections from "./sections.component";

export default class AddEndpoint extends Component {
  state = { modal: false, endpoints: null, endpoint: null, token:null, loadEndpoint:false };

  componentDidMount() {
    const token =localStorage.getItem("Authorization");
    // FETCH GET /api/endpoints <- name and id of all endpoints
    if( token){
    fetch("/api/endpoints/", {
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ loadEndpoint: false, endpoints: data.endpoints });
      })
      .catch((error) => message.warning(error));
    // this.setState({
    //   endpoints: [
    //     { id: "123", name: "hello" },
    //     { id: "456", name: "hey" },
    //   ],
    // });
    }
  }

  changeDriveModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  onOk=()=>{
    fetch("/api/client/addendpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        this.changeDriveModal();
        message.success("Logged In Successfully!");
      })
      .catch((error) => message.warning({ content: error }));
  }

  onCancel=()=>{
    this.changeDriveModal();
    this.setState({endpoint:null});
  }

  render() {
    return (
      <>
        <Modal
          title="Add Endpoint"
          visible={this.state.modal}
          onOk={this.changeDriveModal}
          okText="Add"
          onCancel={this.onCancel}
        >
          {this.state.endpoints && <Sections sections={this.state.endpoints} sname="endpoints"/>}
        </Modal>
        <Button icon={<PlusOutlined />} onClick={this.changeDriveModal}>
          Add Endpoint
        </Button>
      </>
    );
  }
}
