import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./Docs.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import "bootstrap/dist/css/bootstrap.min.css";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ShareDocument from "./SharePopup";
import DeleteDocument from "./DeletePopup";
import CreateDocument from "./CreatePopup";
import RenameDocument from "./RenamePopup";

function Docs(props) {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selected, setSelected] = useState({});



  useEffect(() => {
    GetUserDocs();
  }, [])

  async function GetUserDocs() {

    const response = await fetch(`/api/v1/userdoc/documents/${props.userId}`);
    if (response.status === 200) {
      const data = await response.json();
      setDocs(data);
    }
    if (response.status === 204) {
      console.log("No user documents");
    }
    return;

  }

  const renderTooltipCreate = (props) => (
    <Tooltip id="button-tooltip" {...props} data-bs-theme="dark">
      Create new document
    </Tooltip>
  );

  const renderTooltiplogOut = (props) => (
    <Tooltip id="button-tooltip" {...props} data-bs-theme="dark">
      LogOut
    </Tooltip>
  );



  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <IconButton
      style={{ color: "white" }}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <MoreVertIcon fontSize="medium" />
      {children}
    </IconButton>
  ));

  const DropDownOwner = (props) => {
    return (
      <Dropdown style={{ zIndex: 2, position: "relative" }} drop={"start"}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { setShowRename(true); setSelected(props.doc); }}>
            Rename
          </Dropdown.Item>
          <Dropdown.Item onClick={() => { setShowDelete(true); setSelected(props.doc); }}>
            Delete
          </Dropdown.Item>
          <Dropdown.Item onClick={() => { setShowShare(true); setSelected(props.doc); }}>
            Share
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const DropDownEditor = () => {
    return (
      <Dropdown style={{ zIndex: 2, position: "relative" }} drop={"start"}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowRename(true)}>
            Rename
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowShare(true)}>
            Share
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const LogOut = () => {
    props.setPage('Login')
    localStorage.setItem('page', 'Login')
    localStorage.setItem('user', "")
  };

  const openEditor = (doc) => {
    props.setPage('Editor')
    navigate(`/Docs/${doc.docId}`)
    props.setEdit(doc.Role === "Viewer" ? true : false)
    props.setCurrentOpenDoc(doc.docId);
  }

  return (
    <div className="md mt-3">
      <Navbar className="mb-4">
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltiplogOut}
        >
          <Button
            variant="danger"
            className="me-4 mt-4 rounded-pill"
            size="md"
            style={{ position: "absolute", right: 0 }}
            onClick={LogOut}
          >
            <LogoutIcon />
          </Button>
        </OverlayTrigger>
      </Navbar>
      <Container data-bs-theme="dark" className="md">
        <Row >
          <Col>
            <Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  textAlign: "center",
                  alignItems: "center"
                }}
              >
                <h1 className="display-3">
                  <b>Your Documents </b>
                </h1>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltipCreate}
                >
                  <Button
                    className="rounded-circle"
                    onClick={() => setShowCreate(true)}
                  >
                    <AddIcon sx={{ fontSize: 45 }} />
                  </Button>
                </OverlayTrigger>
              </div>
            </Row>
            <Row>
              <div className="documents">
                {docs.map((doc, key) => {
                  if (doc.Role === "Owner") {
                    return (
                      <Card className="document" key={key}>
                        <Card.Body>
                          <Card.Title>
                            <div
                              style={{
                                justifyContent: "space-between",
                                display: "flex",
                              }}
                            >
                              <h2>{doc.Title}</h2>
                              <DropDownOwner doc={doc} />
                            </div>
                          </Card.Title>
                          <Card.Text
                            style={{
                              overflowY: "auto",
                              scrollbarWidth: "none",
                            }}
                          >
                            {doc.Desc}
                          </Card.Text>
                          <div style={{ justifyContent: "right", display: "flex" }}>
                            <Button variant="outline-secondary" onClick={() => openEditor(doc)}>Open</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  }
                })}
              </div>
            </Row>
          </Col>
          <Col>
            <Row>
              <h1 className="display-3" style={{ textAlign: "center" }}>
                <b>Shared Documents</b>
              </h1>
            </Row>
            <Row>
              <div className="documents">
                {docs.map((doc, key) => {
                  if (doc.Role !== "Owner") {
                    return (
                      <Card className="document" key={key}>
                        <Card.Body>
                          <Card.Title>
                            <div
                              style={{
                                justifyContent: "space-between",
                                display: "flex",
                              }}
                            >
                              <h2>{doc.Title}</h2>
                              {doc.Role === "viewer" ? (
                                <IconButton style={{ color: "white" }} disabled>
                                  <VisibilityIcon fontSize="medium" />
                                </IconButton>
                              ) : (
                                <DropDownEditor />
                              )}
                            </div>
                          </Card.Title>
                          <Card.Text
                            style={{
                              overflowY: "auto",
                              scrollbarWidth: "none",
                            }}
                          >
                            {doc.Desc}
                          </Card.Text>
                          <div style={{ justifyContent: "right", display: "flex" }}>
                            <Button variant="outline-secondary" onClick={() => openEditor(doc)}>Open</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  }
                })}
              </div>
            </Row>
          </Col>
        </Row>
      </Container>

      <ShareDocument showShare={showShare} setShowShare={setShowShare} selected={selected} userId={props.userId} />
      <RenameDocument showRename={showRename} setShowRename={setShowRename} selected={selected} setDocs={setDocs} />
      <DeleteDocument showDelete={showDelete} setShowDelete={setShowDelete} selected={selected} setDocs={setDocs} />
      <CreateDocument showCreate={showCreate} setShowCreate={setShowCreate} GetUserDocs={GetUserDocs} selected={selected} userId={props.userId} />
    </div>
  );
}

export default Docs;
