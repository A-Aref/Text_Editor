import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./Docs.css";


import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
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



function Docs(props) {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([
    { Title: "sale", Role: "Owner", Desc: "ay7aga",docId:"htu59"},
    { Title: "sales3.txt", Role: "Editor", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales1.txt", Role: "Owner", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales4.txt", Role: "Editor", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales4.txt", Role: "Owner", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales4.txt", Role: "Editor", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales4.txt", Role: "Owner", Desc: "ay7aga",docId:"htu9" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "ay7aga",docId:"htu9" },
  ]);

  const [users, setUsers] = useState([
    "Saah",
    "Salah",
    "semo",
    "Saah",
    "Salah",
    "semo",
    "Saah",
    "Salah",
    "semo",
  ]);

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
  const [showCreate, setShowCreate] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selected, setSelected] = useState({});

  const CreateDocument = () => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    function addDocument() {
      const document = { Title: name, Role: "Owner", Desc: desc }
      setDocs([...docs,document])
    }
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showCreate}
        onHide={() => setShowCreate(false)}
        data-bs-theme="dark"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            autoFocus
            placeholder="Doc1"
          />
          <Form.Label htmlFor="desc">Description</Form.Label>
          <Form.Control
            id="desc"
            as="textarea"
            rows={2}
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {addDocument();setShowCreate(false);}}>Create</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const RenameDocument = () => {
    const [rename, setRename] = useState("");
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showRename}
        onHide={() => setShowRename(false)}
        data-bs-theme="dark"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Rename Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            id="name"
            type="text"
            value={rename}
            onChange={(e) => {
              setRename(e.target.value);
            }}
            autoFocus
            placeholder="Doc_1"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowRename(false)}>
            Cancel
          </Button>
          <Button variant="primary">Rename</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const DeleteDocument = () => {
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showDelete}
        onHide={() => setShowDelete(false)}
        data-bs-theme="dark"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selected.Title}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ShareDocument = () => {
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showShare}
        onHide={() => setShowShare(false)}
        data-bs-theme="dark"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Share Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ overflowY: "auto", scrollbarWidth: "none", height: "20rem" }}
        >
          <Table striped style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th>
                  <h1>
                    <i>Name</i>
                  </h1>
                </th>
                <th>
                  <h1>
                    <i>Role</i>
                  </h1>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <h3>{user}</h3>
                    </td>
                    <td style={{ justifyContent: "center" }}>
                      <Form.Select
                        aria-label="Default select example"
                        style={{ width: "8rem", margin: "auto" }}
                      >
                        <option value="none">None</option>
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                      </Form.Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowShare(false)}>
            Cancel
          </Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };

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
          <Dropdown.Item onClick={() => setShowRename(true)}>
            Rename
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setShowDelete(true);
              setSelected(props.doc);
            }}
          >
            Delete
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setShowShare(true)}>
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
    localStorage.setItem('page','Login')
  };

  const openEditor = (doc) => {
    props.setPage('Editor')
    navigate(`/Docs/${doc.docId}`)
    props.setEdit(doc.Role === "Viewer" ? true:false)
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
                          <div style={{justifyContent:"right",display:"flex"}}>
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
                              {doc.Role === "Viewer" ? (
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
                          <div style={{justifyContent:"right",display:"flex"}}>
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
      <CreateDocument />
      <RenameDocument />
      <DeleteDocument />
      <ShareDocument />
    </div>
  );
}

export default Docs;
