import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "bootstrap/dist/css/bootstrap.min.css";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./Signin.css";

function Signin(props) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    props.setPage("Login");
  }, []);

  function Submit() {
    if (email === "" || password === "") {
      setErrorText("Please enter both email and password.");
    } else {
      fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((response) => {
          if (response.ok) {
            props.setPage("Docs");
            navigate("/Docs");
            localStorage.setItem("page", "Docs");
            props.setUser(email);
            localStorage.setItem("user", email);
          } else if (response.status === 400) {
            setErrorText("Invalid email format. Please enter a valid email address.");
          } else if (response.status === 401) {
            setErrorText("Incorrect email or password. Please try again.");
          } else if (response.status === 404) {
            setErrorText("User not found. Please check your email or register.");
          } else {
            setErrorText("An unexpected error occurred. Please try again later.");
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          setErrorText("Network error. Please check your internet connection and try again.");
        });
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
                setPassword(e.target.value);
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
