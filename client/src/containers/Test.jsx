import "../styles/Test.css";
import React, { useState, useRef } from "react";
import { FaCaretRight } from "react-icons/fa"; // https://react-icons.github.io/react-icons
import TimerDisplay from "../components/TimerDisplay";
import Question from "../components/Question";

const Test = (props) => {
  const Ref = useRef(null); // Used for timer
  const questionBank = [images, images2, images3]; // Local questions. Use parsed props eventually
  const questionTimeBank = [13, 120, 120];
  const questionTypeBank = ["multichoice", "multichoice", "entry"];
  const questionTextBank = [
    "Which of the following cubes can you make with these four pieces?",
    "What comes next in the pattern?",
    "How many triangles are there in this picture?",
  ];

  const [questionNum, setQuestionNum] = useState(1);
  const [questionTime, setQuestionTime] = useState(
    questionTimeBank[questionNum - 1]
  );
  const [userAnswers, setUserAnswers] = useState(
    Array.apply(null, Array(questionBank.length))
  );

  const nextQuestion = () => {
    console.log("Answers: " + userAnswers); // for debugging
    if (questionNum < questionBank.length) {
      setQuestionNum(questionNum + 1);
      setQuestionTime(questionTimeBank[questionNum]);
      return true;
    } else {
      alert("No more questions!");
      return false;
    }
  };

  const submitAnswer = (event) => {
    if (questionTypeBank[questionNum - 1] === "entry") {
      event.preventDefault(); // Prevent form entry submission when pressing enter
    }
    let answers = userAnswers;
    answers[questionNum - 1] = event.target.value;
    setUserAnswers(answers);
  };

  const getCurrentQuestionImages = () => {
    return questionBank[questionNum - 1];
  };

  const timeCountDown = () => {
    if (questionTime <= 0) {
      if (!nextQuestion()) {
        clearInterval(Ref.current);
      }
    } else {
      setQuestionTime(questionTime - 1);
    }
  };

  const startTimer = () => {
    if (Ref.current) {
      clearInterval(Ref.current);
    }
    const id = setInterval(() => {
      timeCountDown();
    }, 1000);
    Ref.current = id;
  };

  startTimer();

  return (
    <div className="test">
      <TimerDisplay seconds={questionTime} />

      <Question
        type={questionTypeBank[questionNum - 1]}
        questionImage={getCurrentQuestionImages().at(-1)}
        text={questionTextBank[questionNum - 1]}
        answerImages={getCurrentQuestionImages().slice(
          0,
          getCurrentQuestionImages().length - 1
        )}
        submit={submitAnswer}
      />

      <div className="test__progress" title="Progress">
        {questionNum} / {questionBank.length}
      </div>

      <button
        className="test__next"
        onClick={() => nextQuestion()}
        title="Next Question"
      >
        <FaCaretRight size={60} />
      </button>
    </div>
  );
};

export default Test;

// ----------- Local Question Importing

// Function to get all images from a folder as an array.
// Array order corresponds to folder order (question is last).
function importAll(r) {
  let images = [];
  r.keys().map((item, index) => {
    images.push(r(item));
  });
  return images;

  ////Use these line if you want to access each image using the file name.
  //let images = {};
  //r.keys().map((item, index) => { images[item.replace('./','')] = r(item); });
}
const images = importAll(
  require.context(
    "../assets/questions/perception1",
    false,
    /\.(png|jpe?g|svg)$/
  )
);
const images2 = importAll(
  require.context(
    "../assets/questions/perception4",
    false,
    /\.(png|jpe?g|svg)$/
  )
);
const images3 = importAll(
  require.context(
    "../assets/questions/perception12",
    false,
    /\.(png|jpe?g|svg)$/
  )
);
