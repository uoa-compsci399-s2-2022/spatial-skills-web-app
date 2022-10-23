import "../styles/Home.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { MdErrorOutline } from "react-icons/md";
import jwt_decode from "jwt-decode";
import logo from "../assets/logo.png";

import { adminLogin } from "../services/auth-service.mjs";

const AdminLogin = (props) => {
  const { userData, setUserData } = props;
  const [error, setError] = useState("");

  sessionStorage.setItem("redirectAdmin", "true");

  const handleGoogleLogin = (credentials) => {
    setError("");
    const payload = jwt_decode(credentials);
    adminLogin(payload.email, credentials).then(
      (res) => {
        setUserData({
          name: payload.given_name + " " + payload.family_name,
          email: payload.email,
          picture: payload.picture,
        });
      },
      (error) => {
        setError(error.response.data.message);
      }
    );
  };

  return (
    <div className="home">
      <img src={logo} className="home__logo" alt="" />
      <div className="home__content">
        {userData.name === null ? (
          // Authentication
          <>
            <p className="home__input home__input--text:focus">Admin Login</p>
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleLogin(credentialResponse.credential)
              }
              onError={() => setError("Unable to authenticate Google account!")}
              width="240"
            />
            {error === "" ? null : (
              <div className="home__error">
                <MdErrorOutline size="1.5em" />
                <p>{error}</p>
              </div>
            )}
          </>
        ) : (
          <Navigate to="/dashboard" />
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
