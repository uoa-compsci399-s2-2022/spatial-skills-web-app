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


  const [test, setTest] = useState(false)

  const changeState = () => {
    setTest(true)
    console.log(test)
  }




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
          <Route
            path="pattern"
            element={
            <PatternGame 
            corsi={true}
            gameDim={5}       // width and height of grid
            order={true}        // pattern order/no-order
            reverse={true}      // replicate the pattern in reverse order, order must be true
            maxHealth={5}
            timerState={true}       // set timer on/off
            timeAllowed={60}          // total time if timer on
            patternFlashTime={0.5}      // time to flash each pattern block
            randomLevelOrder={true}      // each level is randomized
            randomSeed={"just a seed"}
            description={
              "Click on the pattern shown at the start of the game, \
              You will lose a life for each mismatch. \
              Progress as far as you can! \
              Click start to begin."}

            changeState={changeState}
            />}
          />

          <Route
            path="matching"
            element={
            <MatchingGame
            pairs={8}                // number of pairs to match
            gameStartDelay={1}       // time to reveal all cards beginning of game
            selectionDelay={1}       // reveal time after a mismatch between 2 cards
            maxHealth={5}
            randomSeed={"Hi"}         
            timerState={true}       // set timer on/off
            timeAllowed={2}         // total time if timer on
            description={
            "Match those cards in pairs before time runs out! \
            You will lose a life for each mismatch. \
            Click start to begin."
            }
            />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );

}

export default App;
