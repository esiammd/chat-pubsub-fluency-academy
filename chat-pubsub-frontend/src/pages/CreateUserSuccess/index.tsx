import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import "./styles.css";

function CreateUserSuccess() {
  return (
    <div className="page_create_user_success">
      <FiCheckCircle className="icon" />
      <span>User created successfully</span>
      <p>
        All right, your registration is on our list of users. Now just connect
        and enjoy the chat.
      </p>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

export default CreateUserSuccess;
