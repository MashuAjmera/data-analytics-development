import React, { Component } from "react";
import { Button, Modal, message  } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sections from "./sections.component";

export default class AddEndpoint extends Component {
  state = { modal: false, endpoints: null, endpoint: null, token:null, loadEndpoint:false };

  componentDidMount() {
    // const token =localStorage.getItem("Authorization");
    // this.setState({ token }, ()=>
    // FETCH name of all the drives GET /api/drives
    // fetch("/api/endpoints/", {
    //   headers: { Authorization: this.state.token },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     this.setState({ loadEndpoint: false, endpoints: data.endpoints });
    //   })
    //   .catch((error) => message.warning({ content: error })));
    // FETCH GET /api/endpoints <- name and id of all endpoints
    this.setState({
      endpoints: [
        { id: "123", name: "hello" },
        { id: "456", name: "hey" },
      ],
    });
  }

  changeDriveModal = () => {
    this.setState({ modal: !this.state.modal });
  };

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
