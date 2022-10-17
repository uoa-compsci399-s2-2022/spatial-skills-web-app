import { useState } from "react";
import "../../styles/SingleBlock.css";

const SingleBlock = ({
  block,
  handleChoice,
  blockState,
  gameOver,
  disabled,
  clicked,
  flash,
  corsiMode,
}) => {
  const [reset, setReset] = useState(false);

  const handleClick = () => {
    if (!block.clicked && !gameOver && !disabled) {
      handleChoice(block);
    }
  };

  const generateClassName = () => {
    if (blockState === "correct") {
      return "block block--correct";
    } else if (blockState === "incorrect") {
      if (flash) {
        return "block block--flash";
      } else {
        return "block block--incorrect";
      }
    } else if (blockState === "grey") {
      return "block";
    }
  };

  const corsiGameMode = () => {
    if (corsiMode) {
      return "block-" + block.id;
    } else {
      return "";
    }
  };

  return (
    <div>
      <div className={corsiGameMode()}>
        <div className={generateClassName()} onClick={handleClick}></div>
      </div>
    </div>
  );
};

export default SingleBlock;
