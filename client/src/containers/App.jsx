import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./Home";
import Test from "./Test";
import Dashboard from "./Dashboard";
import Stats from "./Stats";
import Editor from "./Editor";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
          <Route path="test" element={<Test />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/test/:testId" element={<Stats />} />
          <Route path="dashboard/editor" element={<Editor />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
