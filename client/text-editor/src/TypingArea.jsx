import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestoreIcon from '@mui/icons-material/Restore';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CircleIcon from '@mui/icons-material/Circle';

import ReactQuill, { Quill } from "react-quill";
import QuillCursors, { Cursor } from 'quill-cursors';

import { Client } from "@stomp/stompjs";

import "./TypingArea.css";
import "quill/dist/quill.snow.css";
import { toast } from 'react-toastify';
import { select } from "slate";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


Quill.register('modules/cursors', QuillCursors);
const Delta = Quill.import('delta');

function TypingArea(props) {

  const params = useParams();
  const navigate = useNavigate();
  const ref = useRef();
  const [history, sethistory] = useState([])
  const [value, setValue] = useState();
  const [title, setTitle] = useState("");
  const [client, setStompClient] = useState(null);
  const [openSideHistory, setopenSideHistory] = useState(false);
  const [selectedIndex, setselectedIndex] = useState();


  // const sendData = (content, delta, source, editor) => {
  //   if (client.connected) {
  //     client.publish({
  //       destination: `/app/${params.id}/chat.sendData`,
  //       body: JSON.stringify(editor.getContents()),
  //     });
  //   }
  // };


  useEffect(() => {
    getDocsHistory();
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

  useEffect(() => {
    //Exchange displayed text in case of close history
    if (openSideHistory)
      props.setCurrentText(value);
    if (!openSideHistory) {
      setValue(props.currentText);
      setselectedIndex(null);
    }
  }, [openSideHistory])
  useEffect(() => {
    if (props.currentText)
      if (!openSideHistory)
        props.setCurrentText(null);
  }, [value])


  async function getDocsHistory() {
    try {
      const response = await fetch(`/api/docHistory/${props.currentOpenDoc}`);
      const data = await response.json();
      sethistory(data);
      setValue(data[0].text);

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred');
    }

  }

  const handleTextChange = (content) => {
    //sendData
    setValue(content);
  }

  const handleBack = () => {
    // Handle the save functionality
    navigate("/Docs");
    props.setCurrentText(history[0]);
  };
  const handleSave = () => {
    // Handle the save functionality
    const dataToSave = {
      currentUserEmail: props.currentUserEmail,
      docId: props.currentOpenDoc, text: value
    };
    fetch("/api/docHistory/saveDoc", {
      method: "POST",
      body: JSON.stringify(dataToSave),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        toast.success("Successfully saved");
        getDocsHistory();
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error(error.message || 'An error occurred');
      });
    //sendData()

  };

  const handleDisplayHistoryText = (text) => {
    setValue(text);
  }



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
        <ToastContainer />
        {!props.edit && !openSideHistory ? (
          <div className="rounded" style={{ display: "flex" }}>
            <div style={{ display: "flex" }} id="my-quill-toolbar">
              <button className="edit-button ql-bold" />
              <button className=" edit-button ql-italic" />
            </div>
            <div style={{ display: "flex" }}>
              <button className=" edit-button" onClick={handleSave}>
                <SaveIcon className="saveIcon" sx={{ fontSize: 44 }} />
              </button>

            </div>

          </div>
        ) : (
          <div id="my-quill-toolbar"></div>
        )}
        <button className=" edit-button" onClick={() => { setopenSideHistory(!openSideHistory) }}>
          <RestoreIcon className="saveIcon" sx={{ fontSize: 44 }} />
        </button>
        <h2 style={{ marginRight: "3rem" }}>
          <i>{title}</i>
        </h2>
      </Navbar>
      <br />
      <div id="editorHistoryContainer" className="d-flex flex-row">
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value}
          onChange={handleTextChange}
          modules={{cursors:true, toolbar: { container: "#my-quill-toolbar" } }}
          readOnly={props.edit || openSideHistory}
          id="editor"
        />
        {openSideHistory &&
          <div id="sideHistory" className="w-max rounded mx-2 d-flex flex-column overflow-auto ">
            {history.map((history, index) => {
              return (
                < button
                  onClick={() => { handleDisplayHistoryText(history.text); setselectedIndex(index); }}
                  id="historyButton" key={index} className={`text-white flex-column d-flex 
                  justify-content-center ${selectedIndex === index ? 'bg-primary' : ''}`} >
                  <p id="historyText" className="fs-5">{history.version}</p>
                  <div className="d-flex flex-row">
                    <DesignServicesIcon className="m-1 hover:text-blue-50" fontSize="xsmall" />
                    <p id="historyText" className="fs-7 hover:text-blue-50 w-full">{history.editor}</p>
                  </div>
                </button>
              );
            })}

          </div>}
      </div>
    </div >
  );
}

export default TypingArea;
