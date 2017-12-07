import React from "react";
import { Link } from "react-router-dom";

const home = () => {
  return (
    <div title="Home">
      <h1>Home Page</h1>
      <p>
        <Link to="/about">About</Link>
      </p>
    </div>
  );
};

export default home;
