import "../styles/Dashboard.css";
import { Link, Navigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import axiosAPICaller from "../services/api-service.mjs";

const iconSize = "1.25em";
const Dashboard = () => {
  const [data, setData] = useState([]);

  const url = "/test/mytests";

  useEffect(() => {
    axiosAPICaller.get(url).then((response) => {
      setData(response.data);
    });
  }, []);

  // Redirect non-admin user to home page
  // TODO: if user refreshes page, sessionstorage persists
  if (!sessionStorage.getItem("adminRights")) {
    return <Navigate to="/" />
  }

  // we'll need to authenticate users below this route, maybe check
  // their email with db for admin privilege?
  return (
    <div className="dashboard">
      {data.map((test) => (
        <Link
          className="dashboard__item section"
          key={test._id + test.code}
          to={`/dashboard/test/${test.code}/stats`}
          title="Edit/View"
        >
          <h3>{test.title}</h3>
          <p>{test.code}</p>
        </Link>
      ))}
      <Link
        className="dashboard__create"
        title="Create new test"
        to="/dashboard/test/create"
      >
        <FaPlus size={iconSize} />
      </Link>
    </div>
  );
};

export default Dashboard;
