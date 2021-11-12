import React, { Component } from "react";
import { Collapse, Button, PageHeader, Typography, Empty } from "antd";
import { DeleteOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Client from "./client.component";

export default class Clients extends Component {
  state = { clients: null };

  componentDidMount() {
    // get all client names
    this.setState({
      clients: [
        { id: "1234", name: "cmdclient" },
        { id: "5678", name: "oemclient" },
      ],
    });
  }

  render() {
    const { Panel } = Collapse;
    const { Title } = Typography;
    const genExtra = () => (
      <DeleteOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          // fetch request to delete
        }}
      />
    );

    return (
      <>
        <PageHeader
          className="site-page-header"
          title={<Title level={2}>Clients</Title>}
          extra={[
            <Button type="primary" icon={<AppstoreAddOutlined />}>
              Add Client
            </Button>,
          ]}
        />
        {this.state.clients ? (
          <Collapse accordion bordered={false}>
            {this.state.clients.map((client) => (
              <Panel header={client.name} key={client.id} extra={genExtra()}>
                <Client id={client.id} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty description={<span>No clients created yet!</span>}>
            <Button type="primary" icon={<AppstoreAddOutlined />}>
              Create Client
            </Button>
          </Empty>
        )}
      </>
    );
  }
}
