import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "../styles/App.css";
import Home from "./Home";
import Test from "./Test";
import TestResult from "./TestResult";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import Stats from "./Stats";
import Bank from "./Bank";
import Editor from "./Editor";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PatternGame from "../components/PatternGame/PatternGame";
import MatchingGame from "../components/MatchingGame/MatchingGame";

const GOOGLE_CLIENT_ID =
  "126878629767-elluidkp4g3iost84sgh5spapdq30su7.apps.googleusercontent.com";

function App() {
  const [userData, setUserData] = useState({
    name: null,
    email: null,
    picture: null,
  });
  const [test, setTest] = useState(false);

  const changeState = () => {
    setTest(true);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Navbar userData={userData} setUserData={setUserData} />
        <Routes>
          <Route
            path="/"
            element={<Home userData={userData} setUserData={setUserData} />}
          />
          <Route
            path="/login"
            element={
              <AdminLogin userData={userData} setUserData={setUserData} />
            }
          />
          <Route path="/test" element={<Test userData={userData} />} />
          <Route path="/finish" element={<TestResult />} />
          <Route
            path="*"
            element={
              sessionStorage.getItem("redirectAdmin") === "true" ? (
                <Navigate replace to="/dashboard" />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/test/:code/stats" element={<Stats />} />
          <Route path="dashboard/test/:code/question" element={<Bank />} />
          <Route
            path="dashboard/test/:code/question/:questionId"
            element={<Editor userData={userData} />}
          />
          <Route
            path="dashboard/test/:code"
            element={<Editor userData={userData} />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
