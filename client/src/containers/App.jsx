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
                <Navigate replace to="/dashboard" />
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
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
