import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Docs.css";

import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
 
import "bootstrap/dist/css/bootstrap.min.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

function Docs() {
  const [docs, setDocs] = useState([
    { Title: "sales.txt", Role: "Owner" },
    { Title: "sales3.txt", Role: "Editor" },
    { Title: "sales1.txt", Role: "Owner" },
    { Title: "sales4.txt", Role: "Viewer" },
  ]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props} data-bs-theme="dark">
      Create new document
    </Tooltip>
  );

  return (
    <div className="md mt-3">
      <Container data-bs-theme="dark" className="md">
        <Row>
          <Col>
            <Row>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1 className="display-3">
                  <b>Your Documents </b>
                </h1>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <Button className="rounded-pill r">
                    <AddIcon sx={{ fontSize: 50 }} />
                  </Button>
                </OverlayTrigger>
              </div>
            </Row>
            <Row>
              <Stack className="mt-3" gap={2}>
                {docs.map((doc, key) => {
                  if (doc.Role === "Owner") {
                    return (
                      <div className="documents">
                        <h1>{doc.Title}</h1>
                        <IconButton style={{ color: "white" }}>
                          <MoreVertIcon fontSize="large" />
                        </IconButton>
                      </div>
                    );
                  }
                })}
              </Stack>
            </Row>
          </Col>
          <Col>
            <Row>
              <h1 className="display-3">
                <b>Shared Documents</b>
              </h1>
            </Row>
            <Row>
              <Stack className="mt-3" gap={2}>
                {docs.map((doc, key) => {
                  if (doc.Role !== "Owner") {
                    return (
                      <div className="documents">
                        <h1>{doc.Title}</h1>
                        {doc.Role === "Viewer" ? (
                          <IconButton style={{ color: "white" }}>
                            <MoreVertIcon fontSize="large" />
                          </IconButton>
                        ) : (
                          <IconButton style={{ color: "white" }} disabled>
                            <VisibilityIcon fontSize="large" />
                          </IconButton>
                        )}
                      </div>
                    );
                  }
                })}
              </Stack>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Docs;
