import React from "react";

import "./styles.css";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div className="page_page404">
      <span className="error_404">Oops sorry!</span>
      <span className="text_404">ERROR 404 - PAG NOT FOUND</span>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

export default Page404;
