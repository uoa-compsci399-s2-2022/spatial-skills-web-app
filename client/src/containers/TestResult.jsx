import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
// import axiosAPICaller from "../services/api-service.mjs";
import "../styles/Home.css";
import logo from "../assets/logo.png";

// Test Marking proof of concept.

const TestResult = () => {
  return (
    <div className="home">
      <img src={logo} className="home__logo" alt="" />
      <div className="home__content">
        <>
          <h1>Test Finished</h1>
          <p>
            Well done!
            <br />
            Your answers have been stored for review.
            <br />
            <br />
          </p>
          <Link to="/" className="home__input home__input--button">
            Return Home
          </Link>
        </>

      </div>
    </div>
  )
};

export default TestResult;
