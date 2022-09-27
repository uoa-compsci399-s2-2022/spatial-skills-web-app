import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import dummyData from "../db/dummyTest.json";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import React from "react";

const iconSize = "1.25em";
const Dashboard = () => {

  
  const baseURL = "http://localhost:3001/api/test/all";
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setData(response.data);
    });
  }, []);

  // we'll need to authenticate users below this route, maybe check
  // their email with db for admin privilege?
  return (
    <div className="dashboard">
      {data.map((test) => (
        <Link
          className="dashboard__item section"
          key={test._id + test.code}
          to={`/dashboard/test/${test._id}/stats`}
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
        onClick={() => console.log("POST new test")}
      >
        <FaPlus size={iconSize} />
      </Link>
    </div>
  );
};

export default Dashboard;
