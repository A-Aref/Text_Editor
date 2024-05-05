import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register(props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  async function Registerbutt() {
    if (!/^[a-zA-Z]+$/.test(name.trim())) {
      toast.error("Please enter a valid name (only alphabets).");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is missing.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (pass.trim().length < 8) {
      toast.error("Password must be at least 8 characters long.");
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
      const responseData = await response.text();
      if (response.ok) {
        // Registration successful, redirect to login page
        if (responseData.includes('registered successfully')) { navigate('/Login'); } // User registered successfully
        else if (responseData.includes('already exists'))     { toast.error('User with this email already exists.'); } 
      } else {
        // Registration failed, handle error response
        toast.error(responseData.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Registration failed due to an unexpected error.');
    }
  }

  return (
    <div id="RegisterPage" data-bs-theme="dark" className="md">
      <fieldset id="register">
        <ToastContainer theme='dark'/>
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