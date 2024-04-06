
import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const RenameDocument = (props) => {
    const [rename, setRename] = useState("");

    function DoTheRename() {
      fetch("/api/v1/docs/rename", {
        method: 'POST',
        body: JSON.stringify({ Title: rename, docId: props.selected.docId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
        .then(response => {
          if (!response.ok) { alert('Title cannot be empty'); }
          return response.json();
        })
        .then(data => {
          alert('Document renamed successfully');
          props.setDocs(prevDocs => prevDocs.map(doc => {
            if (doc.docId === props.selected.docId) {
              return { ...doc, Title: rename };
            }
            return doc;
          }));
          props.setShowRename(false)
        })
        .catch(error => {
          console.error('Error occurred while renaming:', error);
        });
    }

    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.showRename}
        onHide={() => props.setShowRename(false)}
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
          <Button variant="danger" onClick={() => props.setShowRename(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={DoTheRename}>Rename</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default RenameDocument