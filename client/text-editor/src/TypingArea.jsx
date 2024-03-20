import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReactQuill,{ Quill } from "react-quill";

import "./TypingArea.css";
import "quill/dist/quill.snow.css";

function TypingArea(props) {

  const params = useParams();
  const navigate = useNavigate();
  const ref  = useRef()

  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");

  useEffect(()=>{
    if(value)
      console.log(ref.current.getEditor().getContents())
  },[value])

  const handleBack = () => {
    // Handle the save functionality
    navigate("/Docs");
  };
  const handleSave = () => {
    // Handle the save functionality
    console.log("Save clicked");
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
        {!props.edit ? (
          <div className="rounded" style={{ display: "flex" }}>
            <div style={{ display: "flex" }} id="my-quill-toolbar">
              <button className="edit-button ql-bold" />
              <button className=" edit-button ql-italic" />
            </div>
            <button className=" edit-button" onClick={handleSave}>
              <SaveIcon className="saveIcon" sx={{ fontSize: 44 }} />
            </button>
          </div>
        ) : (
          <div id="my-quill-toolbar"></div>
        )}
        <h2 style={{ marginRight: "3rem" }}>
          <i>{params.id}</i>
        </h2>
      </Navbar>
      <br />
      <ReactQuill
        ref = {ref}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{ toolbar: { container: "#my-quill-toolbar" } }}
        readOnly={props.edit}
        id="editor"
      />
    </div>
  );
}

export default TypingArea;
