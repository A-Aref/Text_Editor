import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestoreIcon from "@mui/icons-material/Restore";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

import Button from "react-bootstrap/Button";

import ReactQuill, { Quill } from "react-quill";
import QuillCursors, { Cursor } from "quill-cursors";

import { Client } from "@stomp/stompjs";

import "./TypingArea.css";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Quill.register("modules/cursors", QuillCursors);
const Delta = Quill.import("delta");

function TypingArea(props) {
  const params = useParams();
  const navigate = useNavigate();
  const ref = useRef();
  const [history, sethistory] = useState([]);
  const [value, setValue] = useState();
  const [title, setTitle] = useState("");
  const [client, setStompClient] = useState(null);
  const [openSideHistory, setopenSideHistory] = useState(false);
  const [opac, setOpac] = useState(1);
  const [disableH, setDisableH] = useState(false);
  const [selectedIndex, setselectedIndex] = useState();
  const [currentText, setCurrentText] = useState(null);

  const sendData = (content, delta, source, editor) => {
    if (delta.ops[1].insert === " ") {
      if (client.connected) {
        client.publish({
          destination: `/app/${params.id}/chat.sendData`,
          body: JSON.stringify(editor.getContents()),
        });
      }
    }
  };

  const switchToHistory = () => {
    setopenSideHistory(!openSideHistory);
    setOpac(opac === 1 ? 0 : 1);
    if (client.connected) {
      client.deactivate();
    } else {
      client.activate();
    }
  };

  useEffect(() => {
    getDocsHistory();
    fetch(`/api/v1/docs/title/${params.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setTitle(data);
      });
    const client = new Client({
      brokerURL: "ws://localhost:8081/api",
      onConnect: () => {
        client.subscribe(`/app/sub/${params.id}/${props.userId}`, (message) => {
          if (JSON.parse(message.body) !== null)
            setValue(JSON.parse(message.body));
          else {
            client.deactivate();
            toast.error("Document open on another device using same account");
            handleBack();
          }
        });
        client.subscribe(
          `/topic/public/${params.id}`,
          (message) => {
            setValue(JSON.parse(message.body));
          }
        );
        setStompClient(client);
      },
    });
    client.activate();
  }, []);

  useEffect(() => {
    //Exchange displayed text in case of close history
    if (openSideHistory) setCurrentText(value);
    if (!openSideHistory) {
      setValue(currentText);
      setselectedIndex(null);
    }
  }, [openSideHistory]);

  useEffect(() => {
    if (currentText) if (!openSideHistory) setCurrentText(null);
  }, [value]);

  async function getDocsHistory() {
    try {
      const response = await fetch(`/api/docHistory/${params.id}`);
      const data = await response.json();
      if (data.length !== 0) {
        sethistory(data);
        //setValue(data[0].text);
        setDisableH(false);
      } else {
        toast.error("No history avialable");
        setDisableH(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred");
    }
  }

  const handleBack = () => {
    window.location.reload();
    setCurrentText(history[0]);
  };
  const handleSave = () => {
    // Handle the save functionality
    const dataToSave = {
      currentUserEmail: props.userId,
      docId: params.id,
      text: value,
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
        console.error("Error:", error);
        toast.error(error.message || "An error occurred");
      });
    //sendData()
  };

  const handleDisplayHistoryText = (text) => {
    setValue(text);
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
        <ToastContainer />
        {!props.edit ? (
          <div className="rounded" style={{ display: "flex", opacity: opac }}>
            <div style={{ display: "flex" }} id="my-quill-toolbar">
              <button
                className="edit-button ql-bold"
                disabled={openSideHistory}
              />
              <button
                className=" edit-button ql-italic"
                disabled={openSideHistory}
              />
            </div>
            <div style={{ display: "flex", opacity: opac }}>
              <button
                className=" edit-button"
                onClick={handleSave}
                disabled={openSideHistory}
              >
                <SaveIcon className="saveIcon" sx={{ fontSize: 44 }} />
              </button>
            </div>
          </div>
        ) : (
          <div id="my-quill-toolbar"></div>
        )}
        <button
          className=" edit-button"
          onClick={switchToHistory}
          disabled={disableH}
        >
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
          onChange={sendData}
          modules={{
            cursors: true,
            toolbar: { container: "#my-quill-toolbar" },
          }}
          readOnly={props.edit || openSideHistory}
          id="editor"
        />
        {openSideHistory && (
          <div
            id="sideHistory"
            className="w-max rounded mx-2 d-flex flex-column overflow-auto "
          >
            {history.map((history, index) => {
              return (
                <button
                  onClick={() => {
                    handleDisplayHistoryText(history.text);
                    setselectedIndex(index);
                  }}
                  id="historyButton"
                  key={index}
                  className={`text-white flex-column d-flex 
                  justify-content-center ${
                    selectedIndex === index ? "bg-primary" : ""
                  }`}
                >
                  <p id="historyText" className="fs-5">
                    {history.version}
                  </p>
                  <div className="d-flex flex-row">
                    <DesignServicesIcon
                      className="m-1 hover:text-blue-50"
                      fontSize="xsmall"
                    />
                    <p
                      id="historyText"
                      className="fs-7 hover:text-blue-50 w-full"
                    >
                      {history.editor}
                    </p>
                  </div>
                  {/* <Button variant="danger" >Restore</Button> */}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TypingArea;
