import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import dummyData from "../db/dummyTest.json";
import { FaPlus } from "react-icons/fa";

const iconSize = "1.25em";
const Dashboard = () => {
  // we'll need to authenticate users below this route, maybe check
  // their email with db for admin privilege?
  return (
    <div className="dashboard">
      {dummyData.map((test) => (
        <Link
          className="dashboard__test section"
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
