import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../styles/Return.css";

const Return = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
      className="return"
      title="Go Back"
    >
      <IoCaretBackOutline size="3em" />
    </button>
  );
};

export default Return;
