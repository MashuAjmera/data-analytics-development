import React, { Component } from "react";
import { List, Button, message, Spin } from "antd";

export default class Drives extends Component {
  state = { drives: [], loadNext: false };

  componentDidMount() {
    const token = localStorage.getItem("Authorization");
    if (token) {
      this.setState({ loadNext: true });
      fetch("/api/drives/", {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ loadNext: false, drives: data.drives });
        })
        .catch((error) => message.warning({ content: error }));
    }
    // FETCH name of all the drives GET /api/drives
    // this.setState({
    //   drives: [
    //     { name: "ACS880", id: "1234" },
    //     { name: "ACS800", id: "56798" },
    //   ],
    // });
  }

  render() {
    return this.state.loadNext ? (
      <div className="example">
        <Spin size="large" />
      </div>
    ) : (
      <List
        size="small"
        dataSource={this.state.drives}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <Button
              onClick={() => this.props.handleClick(item._id)}
              type="text"
            >
              {item.name}
            </Button>
          </List.Item>
        )}
      />
    );
  }
}
