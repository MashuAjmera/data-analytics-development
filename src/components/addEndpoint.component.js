import React, { Component } from "react";
import { Button, Modal, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sections from "./sections.component";

export default class AddEndpoint extends Component {
  state = {
    modal: false,
    endpoints: null,
    endpoint: null,
    loadEndpoint: false,
    loadButton: false,
  };

  componentDidMount() {
    const token = localStorage.getItem("Authorization");
    // FETCH GET /api/endpoints <- name and id of all endpoints
    if (token) {
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

  onOk = (values) => {
    this.setState({ loadButton: true });
    const token = localStorage.getItem("Authorization");
    if (token) {
      let y = [];
      for (const [key, value] of Object.entries(values)) {
        if (key !== "_id") y.push({ _id: key, value: value });
      }
      let x = {
        clientId: this.props.clientId,
        endpoint: {
          _id: values._id,
          properties: y,
        },
      };
      fetch("/api/clients/addendpoint", {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(x),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.setState({ loadButton: false });
          message.success("Endpoint Added Successfully!");
          console.log(data);
          this.props.setClient(data);
          this.changeDriveModal();
        })
        .catch((error) => message.warning({ content: error }));
    }
  };

  onCancel = () => {
    this.changeDriveModal();
    this.setState({ endpoint: null });
  };

  render() {
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return (
      <>
        <Modal
          title="Add Endpoint"
          visible={this.state.modal}
          onOk={this.onOk}
          onCancel={this.onCancel}
          footer={[
            <Button onClick={this.onCancel}>Cancel</Button>,
            <Button
              form="endpoints"
              key="submit"
              htmlType="submit"
              type="primary"
              loading={this.state.loadButton}
            >
              Add
            </Button>,
          ]}
        >
          <Form
            name="endpoints"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onOk}
            labelCol={{ span: 4 }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Sections sections={this.state.endpoints} sname="endpoints" />
          </Form>
        </Modal>
        <Button icon={<PlusOutlined />} onClick={this.changeDriveModal}>
          Add Endpoint
        </Button>
      </>
    );
  }
}
