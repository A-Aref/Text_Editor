
import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";


const ShareDocument = (props) => {

    const [selectedRoles, setSelectedRoles] = useState([]);

    const [users, setUsers] = useState([
        "Begba",
        "Doma",
        "Hamza",
        "Osama",
        "Shawky",
        "Abdullah",
        "Merwon",
        "Mehned",
        "Tamer",
      ]);

    const handleRoleSelect = (userId, role) => {
      const userIndex = selectedRoles.findIndex(item => item.userId === userId);

      if (userIndex !== -1) {
        const updatedSelectedRoles = [...selectedRoles];
        updatedSelectedRoles[userIndex].role = role;
        setSelectedRoles(updatedSelectedRoles);
      } else {
        setSelectedRoles(prevRoles => [
          ...prevRoles,
          { userId, role }
        ]);
      }
    };

    function DoTheShare() {
      fetch("/api/v1/userdoc/share", {
        method: 'POST',
        body: JSON.stringify({ selectedRoles, docId: props.selected.docId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          alert('Document shared successfully');
          props.setShowShare(false)
        })
        .catch(error => {
          console.error('Error occurred while sharing:', error);
        });
    }

    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.showShare}
        onHide={() => props.setShowShare(false)}
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
                        onChange={(e) => handleRoleSelect(user, e.target.value)}
                        value={selectedRoles.find(item => item.userId === user)?.role || 'none'}
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
          <Button variant="danger" onClick={() => props.setShowShare(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={DoTheShare}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default ShareDocument