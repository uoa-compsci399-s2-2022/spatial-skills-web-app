import "../styles/Navbar.css";
import "../index.css";
import "../styles/Home.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { GoSettings } from "react-icons/go";
import { IoMdHelp } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import React, { useEffect } from "react";

import { logout } from "../services/auth-service.mjs"

const iconSize = "1.5rem";

const Navbar = (props) => {
  const { userData, setUserData } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState(0);
  let r = document.documentElement;

  let [darkMode, setDarkMode] = useState(false);
  const handleChange = () => {
    if(darkMode === false){
      r.style.setProperty('--accent-color', 'white');
      r.style.setProperty('--contrast-color', '#0A0A0A');
      r.style.setProperty('--offwhite-color', '#121111');
      r.style.setProperty('--base-300', '#0A0A0A');
      r.style.setProperty('--mid-color', 'white');
      r.style.setProperty('--dark-color', 'white');
      r.style.setProperty('--dark-color-hover', 'white');
      r.style.setProperty('--error-color', 'white');
      r.style.setProperty('--shadow-color', '#121111');
      r.style.setProperty('--light-font', 'white');
      setDarkMode(true);
    } else {
      r.style.setProperty('--accent-color', '#4895EF');
      r.style.setProperty('--contrast-color', '#ffffff');
      r.style.setProperty('--offwhite-color', '#f2f6f8');
      r.style.setProperty('--base-300', '#e6e8ec');
      r.style.setProperty('--mid-color', '#323944');
      r.style.setProperty('--dark-color', '#262631');
      r.style.setProperty('--dark-color-hover', '#2b2e3a');
      r.style.setProperty('--error-color', '#f51d24');
      r.style.setProperty('--shadow-color', 'rgba(13, 13, 88, 0.05)');
      r.style.setProperty('--light-font', '#54757C');

      setDarkMode(false);
    }
  };

  const contentDb = [
    null,
    <>
      <p>Signed in as</p>
      <h3>{userData.name}</h3>
      <p>{userData.email}</p>
      <Link to="/dashboard" className="navbar__dashboard">
        Dashboard
      </Link>
      <button
        className="navbar__signout"
        onClick={() => {
          googleLogout();
          logout();
          setUserData({ name: null, email: null, picture: null });
          setId(0);
          navigate("/");
        }}
      >
        Sign out
      </button>
    </>,
    <>
      <h2>Settings</h2>
      <h3>Dark Mode</h3>
      <button className="button__dark_mode" onClick={() => handleChange()}></button>
      <div className="button__dark_mode_background"></div>
    </>,
    <>
      <h2>Where do I start?</h2>
      <p>
        You must log in using a name and a test code provided to you by the test creator,
        such as your lecturer or teacher. Once logged in, you may begin the test.{" "}
      </p>
      <h3>What is this test for?</h3>
      <p>
        Testing spatial skills has been proven in a multitude of studies to provide an indication
        of success and understanding within STEM subjects (Science, Technology, Engineering, and Mathematics),
        and therefore is used by teachers and academics as an indicator of your performance within these subjects
        when mapping statistical data.
      </p>
    </>,
  ];

  if (location.pathname === "/test") {
    return null;
  }

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor:
          location.pathname === "/" ? "inherit" : "var(--accent-color)",
      }}
    >
      <Link to="/" style={{ marginRight: "auto" }}>
        <img src={logo} className="navbar__icon" alt="Logo" />
      </Link>
      
      <button onClick={() => setId(3)} className="navbar__button">
        <IoMdHelp className="navbar__icon" size={iconSize} alt="Help button" />
      </button>
      <button
        onClick={() => (userData.name !== null ? setId(1) : null)}
        className="navbar__button"
      >
        {userData.picture === null ? (
          <FaUserCircle
            className="navbar__icon"
            size={iconSize}
            alt="Profile button"
          />
        ) : (
          <img
            src={userData.picture}
            alt=""
            className="navbar__icon"
            style={{ borderRadius: "100%" }}
          />
        )}
      </button>

      {id !== 0 ? (
        <div className="popup">
          <button className="popup__close" onClick={() => setId(0)}>
            <IoClose size={iconSize} />
          </button>
          {contentDb[id]}
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
