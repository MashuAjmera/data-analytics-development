import React, { Component } from "react";
import { Button } from "antd";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default class AddDrive extends Component {
  state = {
    code: `def rule(drive): \n\treturn drive.parameters}`,
  };

  render() {
    return (
      <>
            Modify the code below or{" "}
            <Button
              type="link"
              href="http://localhost:8000/red"
              target="_blank"
              size="small"
            >
              use GUI
            </Button>
            .
            <CodeEditor
              value={this.state.code}
              language="py"
              placeholder="Please enter PY code."
              onChange={(evn) => this.setState({ code: evn.target.value })}
              padding={15}
              style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
          </>
    );
  }
}
