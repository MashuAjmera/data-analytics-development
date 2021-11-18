import React, { Component } from "react";
import {
  Collapse,
  Skeleton,
  Button,
  PageHeader,
  Typography,
  Empty,
  Popover,
  message,
  Input,
} from "antd";
import { DeleteOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Client from "./client.component";

export default class Clients extends Component {
  state = {
    clients: [],
    createClientLoading: false,
    token: null,
    loadClients: false,
  };

  componentDidMount() {
    const token =
      "gAAAAABhZnwaPs6apOa89Ck12PA1ZLq7TNq77qIYvWK7O5f6gDK8BuENXZy8x8hQ7_UzSUzGAuCROXKhHAw3l-gBNM6rXDIg8w==";
    this.setState({ token },this.showClients);
  }
  
  showClients=()=>{
    this.setState({ loadClients: true });
    // FETCH GET /api/clients/ <- all client names
    fetch("/api/clients/", {
      headers: { Authorization: this.state.token },
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

  createClient = (value) => {
    this.setState({ createClientLoading: true });
    // FETCH POST /api/clients/add -> create a blank client
    this.setState({
      clients: [...this.state.clients, { id: "4567", name: value }],
    });
    this.setState({ createClientLoading: false });
  };

  render() {
    const { Panel } = Collapse;
    const { Title } = Typography;
    const genExtra = () => (
      <DeleteOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          // FETCH request to delete
        }}
      />
    );

    return (
      <>
        <PageHeader
          className="site-page-header"
          title={<Title level={2}>Client Dashboard</Title>}
          extra={[
            <Popover
              content={
                <Input.Search
                  placeholder="input client name"
                  onSearch={this.createClient}
                  loading={this.state.createClientLoading}
                  enterButton={<AppstoreAddOutlined />}
                />
              }
            >
              <Button type="primary" icon={<AppstoreAddOutlined />}>
                Create Client
              </Button>
            </Popover>,
          ]}
        />
        <Skeleton loading={this.state.loadClients} active paragraph={{width: "100%", rows: 4}} title={false} >
        {this.state.clients.length >= 1 ? (
          <Collapse accordion bordered={false}>
            {this.state.clients.map((client) => (
              <Panel header={client.name} key={client.id} extra={genExtra()}>
                <Client id={client.id} user={this.props.user} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty description={<span>No client created yet!</span>}/>
        )}
        </Skeleton>
      </>
    );
  }
}
