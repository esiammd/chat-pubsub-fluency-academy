import React, { FormEvent, useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import api from "../../services/api";

import "./styles.css";

function Login() {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      history.push("/chat");
    }
  }, [history]);

  function showPassword() {
    const element = document.getElementById("password");
    const typeElement = element?.getAttribute("type");

    setIsShowPassword(!isShowPassword);

    if (typeElement === "password") {
      element?.setAttribute("type", "text");
    } else {
      element?.setAttribute("type", "password");
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/sessions", { username, password });

      const { token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      history.push("/chat");
    } catch (error) {
      setMessageError(error.response.data.error);
    }
  }

  return (
    <div className="page_login">
      <form onSubmit={handleSubmit} className="form_login">
        <h1>Login</h1>
        <p>Chat Fluency Academy</p>

        {messageError && (
          <div className="error">
            <span>
              <strong>Sorry:</strong> {messageError}
            </span>
          </div>
        )}

        <div className="form_field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form_field">
          <label htmlFor="password">Password:</label>
          <div className="input_button">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" onClick={showPassword}>
              {isShowPassword === false ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
        </div>

        <button type="submit" className="form_button">
          Submit
        </button>

        <div className="create_user">
          <Link to="/create/user">
            Don't have an account? <strong>Create one!</strong>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
