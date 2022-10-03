import "../styles/Home.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import logo from "../assets/logo.png";

import { studentLogin, createStudent } from "../services/auth-service.mjs";

const Home = (props) => {
  const { userData, setUserData } = props;
  const nameRef = useRef(null);
  const codeRef = useRef(null);
  const [error, setError] = useState("");

  sessionStorage.setItem("redirectAdmin", "false");

  const handleSubmit = () => {
    // Handles name login
    setError("");
    const name = nameRef.current.value;
    const code = codeRef.current.value;
    if (name.length === 0) {
      setError("Invalid name!");
    } else if (code === "admin"){
      setError("Invalid code!");
    }else {
      createStudent(name, code)
        .then((res) => {
          return studentLogin(name, code);
        })
        .then((res) => {
          console.log("passed");
          sessionStorage.setItem("code", code);
          setUserData({
            name: name,
            email: null,
            picture: null,
          });
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  };

  return (
    <div className="home">
      <img src={logo} className="home__logo" alt="" />
      <div className="home__content">
        {userData.name === null ? (
          // Authentication
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="home__form"
            >
              <input
                type="text"
                placeholder="Name"
                className="home__input home__input--text"
                ref={nameRef}
              />
              <input
                type="text"
                placeholder="Test Code"
                className="home__input home__input--text"
                ref={codeRef}
              />
              {error === "" ? null : (
                <div className="home__error">
                  <MdErrorOutline size="1.5em" />
                  <p>{error}</p>
                </div>
              )}
              <button className="home__input home__input--button">Enter</button>

              <p>
                Not a student? Login{" "}
                <Link to="/login" className="hyperlink">
                  here!
                </Link>
              </p>
            </form>
          </>
        ) : (
          // Introduction to the test
          <>
            <p>
              Welcome <b>{userData.name}</b> to the [untitled-project]. You will
              be tested on your <i>visuospatial</i> ability. There are [x]
              number of questions, you will have [x] minutes to complete the
              test.
              <br />
              <br />
              To begin, click on the big <b>"Start!"</b> button below. <br />
              <br />
              <b>Good Luck!</b>
            </p>
            <Link to="/test" className="home__input home__input--button">
              Start!
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
