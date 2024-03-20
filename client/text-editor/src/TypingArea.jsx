import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from '@mui/icons-material/Save';
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import "./TypingArea.css";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Add css for snow theme


function TypingArea(props) {

  const modules = {
    toolbar: [
      ['bold', 'italic'],
    ],

  };
  const { quill, quillRef } = useQuill({ modules, placeholder: "Start typing here" });
  const [value, setValue] = useState("")
  const params = useParams()
  const navigate = useNavigate()
  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {

        setValue(quillRef.current.firstChild.innerHTML);
      });
    }
  }, [quill]);
  const handleBack = () => {
    // Handle the save functionality
    navigate('/Docs')
  };
  const handleBold = () => {
    // Handle the save functionality
    console.log("Bold clicked");
  };
  const handleItalic = () => {
    // Handle the save functionality
    console.log("Italic clicked");
  };
  const handleSave = () => {
    // Handle the save functionality
    console.log("Save clicked");
  };

  return (
    <div style={{ justifyContent: "center" }}>
      <Navbar bg="black" style={{ justifyContent: "space-between", }} sticky="top">
        <IconButton style={{ color: "white" }} onClick={handleBack}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        {!props.edit ?
          <div className="rounded">
            {/* <button className="edit-button" onClick={handleBold}>
              <FormatBoldIcon fontSize="large" />
            </button>
            <button className=" edit-button" onClick={handleItalic}>
              <FormatItalicIcon fontSize="large" />
            </button> */}
            <button className=" edit-button" onClick={handleSave}>
              <SaveIcon className="saveIcon" fontSize="medium" />
              <div>Save</div>
            </button>
          </div>
          :
          <div></div>
        }
        <h2 style={{ marginRight: "3rem" }}><i>{params.id}</i></h2>
      </Navbar>
      <br />
      <div style={{ justifyContent: "center", display: "flex" }}>
        <div id="my-quill-toolbar"  >
          <div ref={quillRef} />
        </div>
      </div>
    </div>
  );
}

export default TypingArea;
