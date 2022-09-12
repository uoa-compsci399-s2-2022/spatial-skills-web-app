import "../styles/Dashboard.css";
import { Link, Outlet } from "react-router-dom";
import dummyData from "../db/dummyTest.json";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const iconSize = "1.25em";
const Dashboard = () => {
  // we'll need to authenticate users below this route, maybe check
  // their email with db for admin privilege?
  return (
    <>
      <div className="dashboard">
        <Link to="/dashboard/bank">Question Bank</Link>
        {dummyData.map((test) => (
          <div className="dashboard__test section" key={test._id + test.code}>
            <h3>{test.title}</h3>
            <p>{test.code}</p>
            <div className="dashboard__action-container">
              <Link
                to={`test/${test._id}`}
                title="Edit/View"
                className="dashboard__view-edit"
              >
                <FaEdit size={iconSize} />
              </Link>
              <button
                title="Delete"
                className="dashboard__delete"
                onClick={() => console.log(`DELETE "${test.title}"`)}
              >
                <FaTrash size={iconSize} />
              </button>
            </div>
          </div>
        ))}
        <button
          className="dashboard__create"
          title="Create"
          onClick={() => console.log("POST new test")}
        >
          <FaPlus size="2em" />
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
