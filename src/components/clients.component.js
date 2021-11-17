import React, { Component } from "react";
import {
  Collapse,
  Button,
  PageHeader,
  Typography,
  Empty,
  Popover,
  Input,
} from "antd";
import {
  DeleteOutlined,
  AppstoreAddOutlined,
  FileAddOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import Client from "./client.component";

export default class Clients extends Component {
  state = { clients: [], createClientLoading: false };

  componentDidMount() {
    // FETCH GET /api/clients/ <- all client names
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
          title={<Title level={2}>Clients</Title>}
          extra={[
            <Button type="dashed" icon={<FileAddOutlined />}>
              Create Endpoint
            </Button>,
            <Button type="dashed" icon={<FolderAddOutlined />}>
              Create Drive
            </Button>,
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
        {this.state.clients.length >= 1 ? (
          <Collapse accordion bordered={false}>
            {this.state.clients.map((client) => (
              <Panel header={client.name} key={client.id} extra={genExtra()}>
                <Client id={client.id} user={this.props.user} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty description={<span>No client created yet!</span>}></Empty>
        )}
      </>
    );
  }
}
