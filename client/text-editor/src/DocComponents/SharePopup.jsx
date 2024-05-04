import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const ShareDocument = (props) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUserShare()
  },[props.selected])

  const getUserShare = () => {
    fetch("/api/v1/mixed/getUsers", {
      method: "POST",
      body: JSON.stringify({ docId: props.selected.docId }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      });
  };
  const handleRoleSelect = (userId, role) => {
    const userIndex = users.findIndex((item) => item.email === userId);
    const updateUsers = [...users];
    users[userIndex].role = role;
    setUsers(updateUsers);
  };

  function DoTheShare() {
    fetch("/api/v1/userdoc/share", {
      method: "POST",
      body: JSON.stringify({ users:users, docId: props.selected.docId }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert("Document shared successfully");
        props.setShowShare(false);
      })
      .catch((error) => {
        console.error("Error occurred while sharing:", error);
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
                user.email === props.userId 
                ||
                <tr key={key}>
                  <td>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </td>
                  <td style={{ justifyContent: "center" }}>
                    <Form.Select
                      aria-label="Default select example"
                      style={{ width: "8rem", margin: "auto" }}
                      onChange={(e) =>
                        handleRoleSelect(user.email, e.target.value)
                      }
                      value={
                        users.find((item) => item.email === user.email)
                          ?.role || "none"
                      }
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
        <Button variant="primary" onClick={DoTheShare}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareDocument;
