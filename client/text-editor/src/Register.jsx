import "./Register.css";
import { useNavigate,Link } from "react-router-dom";

import { useEffect, useState } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

function Register(props) {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const [name, setName] = useState("");
  const [phone, setphone] = useState("");
  const [dOB, setDOB] = useState("");
  const [pass, setpass] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [email, setemail] = useState("");
  const [populated, setPopulated] = useState(false);

  function reset() {
    setaddress("");
    setpass("");
    setemail("");
    setName("");
    setphone("");
    setPopulated(false);
  }

  function Registerbutt() {
    setPopulated(true);
    if (!/^[a-zA-Z]+$/.test(name.trim())) {
      setPopulated(false);
      alert("Please enter First name.");
    } else if (!email.trim()) {
      setPopulated(false);
      alert("Email is missing");
    } else if (!address.trim()) {
      setPopulated(false);
      alert("Address is missing");
    } else if (!pass.trim()) {
      setPopulated(false);
      alert("password is missing");
    } else if (!/^[0-9]+$/.test(phone.trim())) {
      setPopulated(false);
      alert("Please enter a valid phone num.");
    }
  }

  return (
    <div id="RegisterPage" data-bs-theme="dark" className="md">
      <p>{errorText}</p>
      <fieldset id="register">
        <h1>Register</h1>
        <br />
        <div id="register_fields">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Form.Label htmlFor="phone">Phone</Form.Label>
          <Form.Control
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => {
              setphone(e.target.value);
            }}
          />
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            id="email"
            type="text"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
          <Form.Label htmlFor="DOB">Date of Birth</Form.Label>
          <Form.Control
            id="DOB"
            type="date"
            value={dOB}
            onChange={(e) => {
              setDOB(e.target.value);
            }}
          />
          <Form.Label htmlFor="Pass">Password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              id="Pass"
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={pass}
              onChange={(e) => {
                setpass(e.target.value);
              }}
            />
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
        </div>
        <div>
          <button id="reg" onClick={Registerbutt}>
            Register
          </button>
          <p>Already have an account? <Link to="/Login">Sign in</Link></p>
        </div>
      </fieldset>
    </div>
  );
}

export default Register;
