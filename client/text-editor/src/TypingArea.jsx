import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestoreIcon from '@mui/icons-material/Restore';

import ReactQuill, { Quill } from "react-quill";
import QuillCursors, { Cursor } from 'quill-cursors';

import { Client } from "@stomp/stompjs";

import "./TypingArea.css";
import "quill/dist/quill.snow.css";

Quill.register('modules/cursors', QuillCursors);
const Delta = Quill.import('delta');

function TypingArea(props) {
  const params = useParams();
  const navigate = useNavigate();
  const ref = useRef();

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [client,setStompClient] = useState(null)

 

  const sendData = (content, delta, source, editor) => {
    console.log(delta)
    //const cursor = ref.current.getEditor().getModule('cursors')
    //cursor.createCursor(props.userId,"hi","red");
    //console.log(cursor.cursors())
    
    if(client.connected) {
      client.publish({
        destination: `/app/${params.id}/chat.sendData`,
        body: JSON.stringify(editor.getContents()),
      });
    }
  };


  useEffect(() => {
    fetch(`/api/v1/docs/title/${params.id}`, {
      method: "GET",
      headers: {"Content-Type": "application/json",},
    })
      .then((response) => {return response.text()})
      .then((data) => {setTitle(data)})
    const client = new Client({
      brokerURL: "ws://localhost:8081/api",
      onConnect: () => {
        client.subscribe(`/app/sub/${params.id}`, (message) => {
          setValue(JSON.parse(message.body))
        });
        client.subscribe(`/topic/public/${params.id}`, (message) => {
          setValue(JSON.parse(message.body))
        });
        setStompClient(client)
      },
    });
    client.activate()
  }, []);

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
            <div style={{ display: "flex" }}>
            <button className=" edit-button" onClick={handleSave}>
              <SaveIcon className="saveIcon" sx={{ fontSize: 44 }} />
            </button>
            <button className=" edit-button" onClick={handleSave}>
              <RestoreIcon className="saveIcon" sx={{ fontSize: 44 }} />
            </button>
            </div>
            
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
        modules={{cursors:true, toolbar: { container: "#my-quill-toolbar" } }}
        readOnly={props.edit}
        id="editor"
      />
    </div>
  );
}

export default TypingArea;
