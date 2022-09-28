import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./Home";
import Test from "./Test";
import TestResult from "./TestResult";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Splash from "../components/Splash";

import PatternGame from "../components/PatternGame/PatternGame";

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
          <Route path="/test" element={<Test userData={userData} />} />
          <Route path="/results/:tId/:sId" element={<TestResult />} />

          <Route path="/pattern" element={<PatternGame 

          gameDim={4} // width and height of grid
          order={false} // pattern order
          maxHealth={5}
          timeAllowed={20} // total time
          patternFlashTime={3} // time to flash each pattern block
          randomLevelOrder={false} // each level is randomized
          randomSeed={"duhh"}

          />} />

        </Routes>
        <Footer />
        <Splash />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
