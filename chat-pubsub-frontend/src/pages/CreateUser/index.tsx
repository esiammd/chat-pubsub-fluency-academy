import React, { FormEvent, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import api from "../../services/api";

import "./styles.css";

function CreateUser() {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [channel, setChannel] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);

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
    if (!username || !password || !channel) {
      alert("Fill in all the fields on the form.");
    }
    try {
      await api.post("/users", { username, password, channel });
      alert("User created successfully.");
      history.push("/");
    } catch (erro) {
      alert("Sorry, there was a registration failure. Please try again.");
    }
  }

  return (
    <div className="page_create_user">
      <header>
        <Link to="/">Back</Link>
      </header>

      <form onSubmit={handleSubmit} className="form_create_user">
        <h1>Create User</h1>

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

        <div className="form_field">
          <label htmlFor="channel">Channel:</label>
          <select
            id="channel"
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
          >
            <option value="" hidden>
              Select a channel
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <button type="submit" className="form_button">
          Register
        </button>
      </form>
    </div>
  );
}

export default CreateUser;
