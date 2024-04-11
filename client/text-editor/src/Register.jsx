import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
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
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  async function Registerbutt() {
    if (!/^[a-zA-Z]+$/.test(name.trim())) {
      setErrorText("Please enter a valid name.");
      return;
    }
    if (!email.trim()) {
      setErrorText("Email is missing.");
      return;
    }
    if (!pass.trim()) {
      setErrorText("Password is missing.");
      return;
    }
    
    try {
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name:name, email:email, pass:pass }),
      });

      if (response.ok) {
        // Registration successful, redirect to login page
        navigate('/Login');
      } else {
        // Registration failed, handle error response
        const data = await response.json();
        setErrorText(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setErrorText('msh fahem.');
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
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Label htmlFor="Pass">Password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              id="Pass"
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <InputGroup.Text>
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                data-bs-theme="dark"
                style={{ color: "white" }}
              >
                {showPassword ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </IconButton>
            </InputGroup.Text>
          </InputGroup>
        </div>
        <div>
          <button id="reg" onClick={Registerbutt}>
            Register
          </button>
          <p>
            Already have an account? <Link to="/Login">Sign in</Link>
          </p>
        </div>
      </fieldset>
    </div>
  );
}

export default Register;
