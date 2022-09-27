import "../styles/Footer.css";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const location = useLocation();
  return (
    <footer
      className="footer"
      style={{ display: location.pathname === "/" ? "flex" : "none" }}
    >
      <p>
        [untitled-project] is developed by Team Marshmallow
        <br />
        Legal | Privacy
      </p>
    </footer>
  );
};

export default Footer;
