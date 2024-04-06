import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "bootstrap/dist/css/bootstrap.min.css";

import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


function Signin(props) {
  const navigate = useNavigate();
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [id, setId] = useState("");
  const [errorText, setErrorText] = useState("  ");

  useEffect(() => {
      props.setPage('Login')
  })

  function Submit() {
    if (id === "" || password === "") {
      if (id === "") {
        setErrorText("Enter the email");
      }
      if (password === "") {
        setErrorText("Enter the password");
      }
    } else 
    {
      // Check in database if user exist
      props.setPage('Docs')
      navigate('/Docs')
      localStorage.setItem('page','Docs')
    }
  }

  return (
    <div id="SigninPage" data-bs-theme="dark" className="md">
      <p id="errorText">{errorText}</p>
      <fieldset id="login" className="md">
        <h1>Sign in</h1>
        <br />
        <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </FloatingLabel>
        <br />
        <InputGroup className="mb-3">
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </FloatingLabel>
          <InputGroup.Text>
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              data-bs-theme="dark"
              style={{ color: "white" }}
            >
              {showPassword ? (
                <VisibilityIcon></VisibilityIcon>
              ) : (
                <VisibilityOffIcon></VisibilityOffIcon>
              )}
            </IconButton>
          </InputGroup.Text>
        </InputGroup>
        <br />
        <button type="submit" id="Signin" onClick={Submit}>
          Sign in
        </button>
        <br />
        <br />
        <Link to="/Register">Create account</Link>
      </fieldset>
    </div>
  );
}

export default Signin;
