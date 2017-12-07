import React from "react";
import { Link } from "react-router-dom";

const about = () => {
  return (
    <div title="About">
      <h1>About Page</h1>
      <p>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
};

export default about;
