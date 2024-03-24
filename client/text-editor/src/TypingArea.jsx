import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReactQuill, { Quill } from "react-quill";

import { Client } from "@stomp/stompjs";

import "./TypingArea.css";
import "quill/dist/quill.snow.css";

function TypingArea(props) {
  const params = useParams();
  const navigate = useNavigate();
  const ref = useRef();

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  const client = new Client({
    brokerURL: "ws://localhost:8080/api",
    onConnect: () => {
      client.subscribe(`/topic/public/${params.id}`, (message) => {
        console.log(`Received: ${message.body}`);
        setValue(JSON.parse(message.body))
      });
    },
  });


  const sendData = () => {
    if(client.connected) {
      client.publish({
        destination: `/app/${params.id}/chat.sendData`,
        body: JSON.stringify(ref.current.getEditor().getContents()),
      });
    }
    else
    {
      client.activate()
    }
  };

  useEffect(() => {
    fetch(" /api/v1/docs/data", {
      method: "POST",
      body: JSON.stringify({ docId: params.id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setValue(data.data);
        setTitle(data.title);
      });
  }, []);

  useEffect(() => {
    if (value) {
      console.log(ref.current.getEditor().getContents());
    }
  }, [value]);

  const handleBack = () => {
    // Handle the save functionality
    navigate("/Docs");
  };
  const handleSave = () => {
    // Handle the save functionality
    console.log("Save clicked");
    sendData()
  };

  return (
    <div style={{ justifyContent: "center" }}>
      <Navbar
        bg="black"
        style={{ justifyContent: "space-between" }}
        sticky="top"
      >
        <IconButton style={{ color: "white" }} onClick={handleBack}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        {!props.edit ? (
          <div className="rounded" style={{ display: "flex" }}>
            <div style={{ display: "flex" }} id="my-quill-toolbar">
              <button className="edit-button ql-bold" />
              <button className=" edit-button ql-italic" />
            </div>
            <button className=" edit-button" onClick={handleSave}>
              <SaveIcon className="saveIcon" sx={{ fontSize: 44 }} />
            </button>
          </div>
        ) : (
          <div id="my-quill-toolbar"></div>
        )}
        <h2 style={{ marginRight: "3rem" }}>
          <i>{title}</i>
        </h2>
      </Navbar>
      <br />
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        onChange={sendData}
        modules={{ toolbar: { container: "#my-quill-toolbar" } }}
        readOnly={props.edit}
        id="editor"
      />
    </div>
  );
}

export default TypingArea;
