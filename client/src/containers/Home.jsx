import "../styles/Home.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { MdErrorOutline } from "react-icons/md";
import jwt_decode from "jwt-decode";
import logo from "../assets/logo.png";

import login from "../services/auth-service.mjs"

const Home = (props) => {
  const { userData, setUserData } = props;
  const nameRef = useRef(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    const name = nameRef.current.value;
    if (name.length === 0) {
      setError("Invalid name!");
    } else {
      login(name).then((res)=>{setUserData({
        name: name,
        email: null,
        picture: null,
      })},
      (error)=>{
        setError(error.response.data.message);
      }
      );
    }
  };

  const handleGoogleLogin = (credentials) => {
    setError("");
    const payload = jwt_decode(credentials);
    console.log(payload);
    setUserData({
      name: payload.given_name + " " + payload.family_name,
      email: payload.email,
      picture: payload.picture,
    });
  };

  return (
    <div className="home">
      <img src={logo} className="home__logo" alt="" />
      <div className="home__content">
        {userData.name === null ? (
          // Authentication
          <>
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleLogin(credentialResponse.credential)
              }
              onError={() => setError("Unable to authenticate Google account!")}
              width="240"
            />
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
              {error === "" ? null : (
                <div className="home__error">
                  <MdErrorOutline size="1.5em" />
                  <p>{error}</p>
                </div>
              )}
              <button className="home__input home__input--button">Enter</button>
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
