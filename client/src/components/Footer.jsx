import "../styles/Footer.css";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const location = useLocation();
  // Hide footer on test page.
  if (location.pathname === "/test") {
    return null;
  }

  return (
    <footer
      className="footer"
      style={{ display: location.pathname === "/" ? "flex" : "none" }}
    >
      <p>
        Visuo is developed by Team Marshmallow
        <br />
        Legal | Privacy
      </p>
    </footer>
  );
};

export default Footer;
