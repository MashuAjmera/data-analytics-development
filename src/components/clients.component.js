import React, { Component } from "react";
import {
  Collapse,
  Spin,
  Button,
  PageHeader,
  Typography,
  Empty,
  Popover,
  message,
  Tooltip,
  Input,
} from "antd";
import {
  DeleteOutlined,
  FolderAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Client from "./client.component";

export default class Clients extends Component {
  state = {
    clients: [],
    createClientLoading: false,
    loadClients: false,
    loadPublish:false
  };

  componentDidMount() {
    this.showClients();
  }

  showClients = () => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ loadClients: true });
      // FETCH GET /api/clients/ <- all client names
      fetch("/api/clients/", {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadClients: false, clients: data.clients });
        })
        .catch((error) => message.warning({ content: error }));
      // this.setState({
      //   clients: [
      //     { id: "1234", name: "cmdclient" },
      //     { id: "5678", name: "oemclient" },
      //   ],
      // });
    }
  };

  createClient = (value) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ createClientLoading: true });
      fetch("/api/clients/add", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: value }),
      })
        .then((response) => response.json())
        .then((data) => {
          message.success("Client Created Successfully.");
          this.setState({ createClientLoading: false });
          this.showClients();
        })
        .catch((error) => message.warning({ content: error }));
    }
    // this.setState({
    //   clients: [...this.state.clients, { id: "4567", name: value }],
    // });
    // this.setState({ createClientLoading: false });
  };

  publish = (_id) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({loadPublish:true})
      fetch(`/api/clients/publish/${_id}`, {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          message.success({ content: "Client published successfully." });
          this.setState({loadPublish:false});
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    const { Panel } = Collapse;
    const { Title } = Typography;
    const genExtra = (_id) => {
      const token = localStorage.getItem("Authorization");
      if (token) {
        const key = "updatable";
        message.loading({
          content: "Sending Request...",
          key,
          duration: 10,
        });
        fetch(`/api/clients/${_id}`, {
          headers: { Authorization: token },
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            message.success({
              content: "Client deleted successfully.",
              key,
            });
            this.showClients();
          })
          .catch((error) => console.log(error));
      }
    };

    return (
      <>
        <PageHeader
          className="site-page-header"
          title={<Title level={2}>App Development Dashboard</Title>}
          extra={[
            <Popover
              content={
                <Input.Search
                  placeholder="input new app name"
                  onSearch={this.createClient}
                  loading={this.state.createClientLoading}
                  enterButton={<FolderAddOutlined />}
                />
              }
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Create App
              </Button>
            </Popover>,
          ]}
        />
        {this.state.loadClients ? (
          <div className="example">
            <Spin size="large" />
          </div>
        ) : this.state.clients.length >= 1 ? (
          <Collapse accordion bordered={false}>
            {this.state.clients.map((client) => (
              <Panel
                header={client.name}
                key={client._id}
                extra={[
                  client.publish ? (
                    <Button type="text" disabled
                    size="small">
                      Published
                    </Button>
                  ) : (
                    <Button
                      type="text"
                      onClick={() => this.publish(client._id)}
                      loading={this.state.loadPublish}
                      danger
                      size="small"
                    >
                      Submit for Approval
                    </Button>
                  ),
                  <Tooltip title="Click to delete app"><DeleteOutlined onClick={() => genExtra(client._id)} /></Tooltip>,
                ]}
              >
                <Client _id={client._id} user={this.props.user} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty description={<span>No client created yet!</span>} />
        )}
      </>
    );
  }
}
