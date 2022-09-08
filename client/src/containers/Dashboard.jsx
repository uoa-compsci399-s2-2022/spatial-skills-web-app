import "../styles/Dashboard.css";
import { Link, Outlet } from "react-router-dom";
const Dashboard = () => {
  // we'll need to authenticate users below this route, maybe check
  // their email with db for admin privilege?
  return (
    <>
      <div className="dashboard">
        <h1>Dashboard page</h1>
        <Link to="editor" className="dashboard__editor">
          Editor
        </Link>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
