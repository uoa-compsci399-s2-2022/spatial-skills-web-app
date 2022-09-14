import "../styles/Navbar.css";
import logo from "../assets/logo.png";
import logoColor from "../assets/logo-color.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { GoSettings } from "react-icons/go";
import { IoMdHelp } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const iconSize = "1.5rem";

const Navbar = (props) => {
  const { userData, setUserData } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState(0);

  const contentDb = [
    null,
    <>
      <p>Signed in as</p>
      <h3>{userData.name}</h3>
      <p>{userData.email}</p>
      <button
        className="navbar__signout"
        onClick={() => {
          googleLogout();
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
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac
        purus laoreet, consequat ante eu, aliquam neque.
      </p>
      <h3>Dark Mode</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <h3>Slider Timer</h3>
      <p>Show the remaining question time using a moving bar.</p>
    </>,
    <>
      <h2>Looking for some help?</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac
        purus laoreet, consequat ante eu, aliquam neque. Fusce finibus tristique
        dui ac pretium.{" "}
      </p>
      <h3>Sub-title describing cool stuff!</h3>
      <p>
        Nulla commodo dui at convallis placerat. Etiam congue odio quis
        ultricies dignissim. Proin fringilla dignissim nibh, tempus efficitur
        dolor maximus eget.
        <br></br>
        <br></br>
        Quisque diam quam, tristique gravida lectus id, hendrerit eleifend
        felis.
      </p>
    </>,
  ];

  console.log(location.pathname === "/test");

  return (
    <nav
      className="navbar"
      style={{
        color:
          location.pathname === "/test"
            ? "var(--accent-color)"
            : "var(--contrast-color)",
      }}
    >
      <Link to="/" style={{ marginRight: "auto" }}>
        <img
          src={location.pathname === "/test" ? logoColor : logo}
          className="navbar__icon"
          alt="Logo"
        />
      </Link>
      <button onClick={() => setId(2)} className="navbar__button">
        <GoSettings
          className="navbar__icon"
          size={iconSize}
          alt="Settings button"
        />
      </button>
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
