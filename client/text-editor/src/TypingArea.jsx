import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestoreIcon from "@mui/icons-material/Restore";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import ReactQuill, { Quill } from "react-quill";
import QuillCursors, { Cursor } from "quill-cursors";

import { Client } from "@stomp/stompjs";
import Card from "react-bootstrap/Card";
import "./TypingArea.css";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CRDT from "./LSEQ/CRDT";

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
  const [CRDTData, setCRDTData] = useState(new CRDT());
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    //Exchange displayed text in case of close history
    if (!openSideHistory) {
      setselectedIndex(null);
    }
  }, [openSideHistory]);

  useEffect(() => {
    if (currentText) if (!openSideHistory) setCurrentText(null);
  }, [value]);

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
      brokerURL: "ws://192.168.1.101:8081/api",
      onConnect: () => {
        client.subscribe(`/app/sub/${params.id}/${props.userId}`, (message) => {
          if (JSON.parse(message.body) !== null) {
            let arr = JSON.parse(message.body);
            for (let i in arr) {
              CRDTData.addNode(i - 1, { uuid: arr[i].uuid, data: arr[i].data });
              remoteInsert(i, arr[i].data);
            }
          } else {
            client.deactivate();
            toast.error("Document open on another device using same account");
            handleBack();
          }
        });
        client.subscribe(`/topic/public/${params.id}`, (message) => {
          const info = JSON.parse(message.body);
          if (info["userId"] === props.userId) return;

          if (info["type"] === "insert") {
            const tempNode = CRDTData.addNode_Id(info["loc"], info["data"]);
            remoteInsert(
              info["loc"] === "-1"
                ? 0
                : CRDTData.getInsertIndex_Id(tempNode[0].getUUID()),
              info["data"]["data"]
            );
          }
          if (info["type"] === "delete") {
            const deletedNode = CRDTData.deleteNode_Id(info["loc"]);
            remoteDelete(
              info["loc"] === "-1"
                ? 0
                : CRDTData.getInsertIndex_Id(deletedNode.getUUID())
            );
          }
          if (info["type"] === "retain") {
            const tempNode = CRDTData.update_Id(info["loc"], info["data"]);
            remoteRetain(
              info["loc"] === "-1"
                ? -1
                : CRDTData.getInsertIndex_Id(tempNode.getUUID()),
              info["data"]
            );
          }
        });
        client.subscribe(`/topic/public/update/${params.id}`, (message) => {
          setCRDTData(new CRDT());
          ref.current.getEditor().setContents(new Delta().insert("\n"), "api");
          if (JSON.parse(message.body) !== null) {
            let arr = JSON.parse(message.body);
            for (let i in arr) {
              CRDTData.addNode(i - 1, { uuid: arr[i].uuid, data: arr[i].data });
              remoteInsert(i, arr[i].data);
            }
          }
        });
        setStompClient(client);
      },
    });
    client.activate();
  }, []);

  function remoteInsert(index, data) {
    if (ref.current) {
      ref.current.getEditor().editor.insertText(
        index,
        data["char"],
        {
          italic: data["italic"],
          bold: data["bold"],
        },
        "silent"
      );
    }
  }

  function remoteDelete(index) {
    if (ref.current) {
      ref.current.getEditor().editor.deleteText(index, 1, "silent");
    }
  }

  function remoteRetain(index, data) {
    if (ref.current) {
      ref.current.getEditor().editor.formatText(
        index <= 0 ? 0 : index - 1,
        1,
        {
          italic: data["italic"] === undefined ? false : data["italic"],
          bold: data["bold"] === undefined ? false : data["bold"],
        },
        "silent"
      );
    }
  }

  function insert(chars, startIndex, attributes, source) {
    let index = startIndex;
    for (let i in chars) {
      let char = chars[i];
      const data = {
        char: char,
        bold: attributes === undefined ? false : attributes["bold"],
        italic: attributes === undefined ? false : attributes["italic"],
      };
      const insertedNode = CRDTData.addNode(index, { uuid: null, data: data });

      if (client.connected && source !== "silent") {
        client.publish({
          destination: `/app/${params.id}/chat.sendData`,
          body: JSON.stringify({
            type: "insert",
            loc: index === -1 ? "-1" : insertedNode[0].getUUID(),
            data: { uuid: insertedNode[1].getUUID(), data: data },
            userId: props.userId,
          }),
        });
      }
      index += 1;
    }
  }

  function delete_local(startIndex, length, source) {
    let index = startIndex;
    for (let i = 0; i < length; i++) {
      try {
        if (source !== "api") {
          const deletedNode = CRDTData.deleteNode(index + 1);
          if (client.connected && source !== "silent") {
            client.publish({
              destination: `/app/${params.id}/chat.sendData`,
              body: JSON.stringify({
                type: "delete",
                loc: deletedNode.getUUID(),
                userId: props.userId,
              }),
            });
          }
        }
      } catch {
        toast.error("failed to find relative index");
      }
    }
  }

  function retain(index, len, attributes, source) {
    for (let i = 0; i < len; i++) {
      try {
        /* set in frontend */
        let loc = CRDTData.update(index + i + 1, attributes);
        /* set in backend */
        if (client.connected && source !== "silent") {
          client.publish({
            destination: `/app/${params.id}/chat.sendData`,
            body: JSON.stringify({
              type: "retain",
              loc: index === -1 ? "-1" : loc.getUUID(),
              data: loc.getData(),
              userId: props.userId,
            }),
          });
        }
      } catch {
        toast.error("failed to find relative index");
      }
    }
  }

  function inspectDelta(ops, index, source) {
    if (ops["insert"] != null) {
      let chars = ops["insert"];
      let attributes = ops["attributes"];
      insert(chars, index, attributes, source);
    } else if (ops["delete"] != null) {
      let len = ops["delete"];
      delete_local(index, len, source);
    } else if (ops["retain"] != null) {
      let len = ops["retain"];
      let attributes = ops["attributes"];
      retain(index, len, attributes, source);
    }
  }

  const sendData = (content, delta, source, editor) => {
    if (!openSideHistory) {
      let index = delta.ops[0]["retain"] || 0;
      index = index - 1;
      if (delta.ops.length === 4) {
        const deleteOps_1 = delta.ops[1];
        inspectDelta(deleteOps_1, index, source);
        index += delta.ops[2]["retain"];
        const deleteOps_2 = delta.ops[3];
        inspectDelta(deleteOps_2, index, source);
      } else if (delta.ops.length === 3) {
        const deleteOps = delta.ops[2];
        inspectDelta(deleteOps, index, source);
        const insert = delta.ops[1];
        inspectDelta(insert, index, source);
      } else if (delta.ops.length === 2) {
        inspectDelta(delta.ops[1], index, source);
      } else {
        if (delta.ops[0]["retain"] === undefined) {
          inspectDelta(delta.ops[0], index, source);
        } else {
          inspectDelta(delta.ops[0], -1, source);
        }
      }
    }
    setValue(content);
  };

  // if (client.connected && source !== 'silent') {
  //   client.publish({
  //     destination: `/app/${params.id}/chat.sendData`,
  //     body: JSON.stringify(editor.getContents()),
  //   });
  // }

  const switchToHistory = () => {
    setopenSideHistory(!openSideHistory);
    setOpac(opac === 1 ? 0 : 1);
    if (client.connected) {
      client.deactivate();
      setCRDTData(null);
    } else {
      ref.current.getEditor().setContents(new Delta().insert("\n"), "api");
      setCRDTData(new CRDT());
      client.activate();
    }
  };

  async function getDocsHistory() {
    setLoading(true);
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
      setLoading(false);
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
    if (value === null) {
      toast.error("No new changes have ocuured");
      return;
    }
    const dataToSave = {
      currentUserEmail: props.userId,
      docId: params.id,
      text: value,
      text_Object: CRDTData.traverseTree(),
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

  const rollback = (props) => {
    // Handle the save functionality
    if (value === null) {
      toast.error("No new changes have ocuured");
      return;
    }
    switchToHistory();
    const rollbackData = {
      version: props,
      docId: params.id,
    };
    setTimeout(() => {
      if (client.connected) {
        client.publish({
          destination: `/app/${params.id}/chat.updateData`,
          body: JSON.stringify(rollbackData),
        });
      }
    }, 50);
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
        <ToastContainer theme="dark" />
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
        {!props.edit ? (
          <button
            className=" edit-button"
            onClick={switchToHistory}
            disabled={disableH}
            aria-controls="example-collapse-text"
            aria-expanded={openSideHistory}
          >
            {Loading && (
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {!Loading && (
              <RestoreIcon className="saveIcon" sx={{ fontSize: 44 }} />
            )}
          </button>
        ) : (
          <></>
        )}
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
        <Collapse in={openSideHistory} dimension="width">
          <Card
            className="overflow-y-scroll "
            style={{ width: "170px" }}
            id="example-collapse-text"
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
                  className={`text-white flex-column d-flex min-w-max
                  justify-content-center ${
                    selectedIndex === index ? "bg-primary" : ""
                  } `}
                  style={{ width: "200px" }}
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
                  <p
                    id="setCurrent"
                    onClick={() => {
                      rollback(history.id);
                    }}
                  >
                    Set current
                  </p>
                </button>
              );
            })}
          </Card>
        </Collapse>
      </div>
    </div>
  );
}

export default TypingArea;
