

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

const DeleteDocument = (props) => {

    function DoTheDelete() {
      fetch("/api/v1/docs/delete", {
        method: 'POST',
        body: JSON.stringify({ docId: props.selected.docId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
        .then(response => {
          if (!response.ok) { toast.error('Can not Delete the Document'); }
          return response.json();
        })
        .then(data => {
          toast.success('Document deleted successfully');
          props.setDocs(prevDocs => prevDocs.filter(doc => doc.docId !== props.selected.docId));
          props.setShowDelete(false)
        })
        .catch(error => {
          console.error('Error occurred while renaming:', error);
        });
    }

    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.showDelete}
        onHide={() => props.setShowDelete(false)}
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
          Are you sure you want to delete "{props.selected.Title}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={DoTheDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default DeleteDocument