import "../styles/Dashboard.css";
import { Link, Outlet } from "react-router-dom";
import dummyData from "../db/dummyTest.json";
import { FaPlus } from "react-icons/fa";

const iconSize = "1.25em";
const Dashboard = () => {
  // we'll need to authenticate users below this route, maybe check
  // their email with db for admin privilege?
  return (
    <>
      <div className="dashboard">
        <Link to="/dashboard/bank" className="button button--outlined">
          Question Bank
        </Link>
        {dummyData.map((test) => (
          <Link
            className="dashboard__test section"
            key={test._id + test.code}
            to={`test/${test._id}`}
            title="Edit/View"
          >
            <h3>{test.title}</h3>
            <p>{test.code}</p>
          </Link>
        ))}
        <button
          className="dashboard__create"
          title="Create"
          onClick={() => console.log("POST new test")}
        >
          <FaPlus size={iconSize} />
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
