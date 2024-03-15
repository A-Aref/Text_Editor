import React from "react";
import { useParams,useNavigate } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";

import SaveIcon from '@mui/icons-material/Save';
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import "./TypingArea.css";

function TypingArea(props) {
  const params = useParams()
  const navigate = useNavigate()
  // const TypingBox = () => {
  //   const [text, setText] = useState("");
  // };
  const handleBack = () => {
    // Handle the save functionality
    props.saveLocal('Docs')
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
    <div style={{justifyContent:"center"}}>
      <Navbar bg="black" style={{justifyContent: "space-between",}} sticky="top">
        <IconButton style={{ color: "white"}} onClick={handleBack}>
         <ArrowBackIcon fontSize="large"/>
        </IconButton>
        <div className="rounded">
        <button className="edit-button" onClick={handleBold}>
         <FormatBoldIcon fontSize="large"/>
        </button>
        <button className=" edit-button" onClick={handleItalic}>
          <FormatItalicIcon fontSize="large"/>
        </button>
        <button className=" edit-button" onClick={handleSave}>
          <SaveIcon fontSize="large"/>
        </button>
        </div>
        <h2 style={{marginRight:"3rem"}}><i>{params.id}</i></h2>
      </Navbar>
      <br />
      <div style={{justifyContent:"center",display:"flex"}}>
      <textarea
        className="textarea"
        // value={text}
        // onChange={handleChange}
        placeholder="Start typing..."
        disabled = {props.edit}
      />
      </div>
    </div>
  );
}

export default TypingArea;
