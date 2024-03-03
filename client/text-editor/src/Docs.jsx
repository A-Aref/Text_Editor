import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Docs.css";

import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
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
    { Title: "sales.txt", Role: "Owner", Desc: "Beahebak" },
    { Title: "sales3.txt", Role: "Editor", Desc: "Beahebak" },
    { Title: "sales1.txt", Role: "Owner", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    { Title: "sales4.txt", Role: "Viewer", Desc: "Beahebak" },
    {
      Title: "sales4.txt",
      Role: "Viewer",
      Desc: "BeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBakBebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBeahebakBakBebak",
    },
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
              <div className="documents">
                {docs.map((doc, key) => {
                  if (doc.Role === "Owner") {
                    return (
                      <Card className="document">
                        <Card.Body>
                          <Card.Title>
                            <div
                              style={{
                                justifyContent: "space-between",
                                display: "flex",
                              }}
                            >
                              <h2>{doc.Title}</h2>
                              <IconButton style={{ color: "white" }}>
                                <MoreVertIcon fontSize="medium" />
                              </IconButton>
                            </div>
                          </Card.Title>
                          <Card.Text
                            style={{
                              overflowY: "auto",
                              height: "10vh",
                              scrollbarWidth: "none",
                            }}
                          >
                            {doc.Desc}
                          </Card.Text>
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
              <h1 className="display-3">
                <b>Shared Documents</b>
              </h1>
            </Row>
            <Row>
              <div className="documents">
                {docs.map((doc, key) => {
                  if (doc.Role !== "Owner") {
                    return (
                      <Card className="document">
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
                                <IconButton style={{ color: "white" }}>
                                  <MoreVertIcon fontSize="medium" />
                                </IconButton>
                              )}
                            </div>
                          </Card.Title>
                          <Card.Text
                            style={{
                              overflowY: "auto",
                              height: "10vh",
                              scrollbarWidth: "none",
                            }}
                          >
                            {doc.Desc}
                          </Card.Text>
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
    </div>
  );
}

export default Docs;
