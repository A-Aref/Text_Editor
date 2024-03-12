import React from "react";
import { Save, Bold, Italic } from "lucide-react";
import "./TypingArea.css";

function TypingArea({ text }) {
  // const TypingBox = () => {
  //   const [text, setText] = useState("");
  // };
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
    <div>
      <div className="UpperBar">
        <button className=" edit-button" onClick={handleBold}>
          <Bold size={24} />
        </button>
        <button className=" edit-button" onClick={handleItalic}>
          <Italic size={24} />
        </button>
        <button className=" edit-button" onClick={handleSave}>
          <Save size={24} />
        </button>
      </div>
      <textarea
        className="textarea"
        // value={text}
        // onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default TypingArea;
