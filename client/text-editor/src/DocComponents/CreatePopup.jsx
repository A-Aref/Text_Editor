
import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CreateDocument = (props) => {
    const [newDocTitle, setnewDocTitle] = useState("");
    const [newDocDesc, setnewDocDesc] = useState("");
    const [enableCreate, setenableCreate] = useState(false);
    useEffect(() => {
      if (!(newDocTitle === ""))
        setenableCreate(false);
      else
        setenableCreate(true);

    }, [newDocTitle])

    function CreateDocApi() {
      fetch("/api/v1/userdoc/createDoc", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json"
        },
        body: JSON.stringify({ docTitle: newDocTitle, docDesc: newDocDesc, userId: props.userId }),
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // If the response is JSON, parse it
          } else {
            throw new Error('Request failed');
          }
        })
        .then(props.GetUserDocs)
        .catch(error => {
          console.error('Error occurred ', error);
        });

    }
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.showCreate}
        onHide={() => props.setShowCreate(false)}
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
            value={newDocTitle}
            onChange={(e) => {
              setnewDocTitle(e.target.value);
            }}
            autoFocus
            placeholder="Doc1"
          />
          <Form.Label htmlFor="desc">Description</Form.Label>
          <Form.Control
            id="desc"
            as="textarea"
            rows={2}
            value={newDocDesc}
            onChange={(e) => {
              setnewDocDesc(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => props.setShowCreate(false)}>
            Cancel
          </Button>
          <Button disabled={enableCreate}
            variant="primary" onClick={() => { CreateDocApi(); props.setShowCreate(false); }}>Create</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default CreateDocument;