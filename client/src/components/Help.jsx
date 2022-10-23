import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import "../styles/Help.css";

const Help = (props) => {
  const { content, disabled } = props;
  const [displayTooltip, setDisplayTooltip] = useState(false);
  return (
    <div
      onMouseEnter={() => setDisplayTooltip(true)}
      onMouseLeave={() => setDisplayTooltip(false)}
      className={disabled ? "help--disabled" : "help"}
      disabled={disabled}
    >
      <FaQuestionCircle size="1.25em" />
      <div
        className="help__tooltip"
        style={{ display: displayTooltip ? "flex" : "none" }}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Help;
