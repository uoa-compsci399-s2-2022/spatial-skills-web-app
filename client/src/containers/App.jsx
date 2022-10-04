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
          <Route path="/results/:tId/:sId" element={<TestResult />} />
          <Route
            path="*"
            element={
              sessionStorage.getItem("redirectAdmin") === "true" ? (
                <Navigate replace to="/login" />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/test/:testId/stats" element={<Stats />} />
          <Route path="dashboard/test/:testId/question" element={<Bank />} />
          <Route
            path="dashboard/test/:testId/question/:questionId"
            element={<Editor userData={userData} isTest={false} />}
          />
          <Route
            path="dashboard/test/:testId"
            element={<Editor userData={userData} isTest={true} />}
          />

          <Route
            path="pattern"
            element={
            <PatternGame 
            gameDim={6}       // width and height of grid
            order={true}        // pattern order/no-order
            maxHealth={15}
            timerState={true}       // set timer on/off
            timeAllowed={10}          // total time if timer on
            patternFlashTime={0.5}      // time to flash each pattern block
            randomLevelOrder={false}      // each level is randomized
            randomSeed={"just a seed"}
            />}
          />

          <Route
            path="matching"
            element={
            <MatchingGame
              timeAllowed={20}
            />}
          />

        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
