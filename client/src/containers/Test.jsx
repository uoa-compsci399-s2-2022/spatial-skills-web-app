import "../styles/Test.css";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretRight } from "react-icons/fa"; // https://react-icons.github.io/react-icons
import TimerDisplay from "../components/TimerDisplay";
import Question from "../components/Question";


const Test = (props) => {
  const Ref = useRef(null); // Used for timer

  const [questionBank, setQuestionBank] = useState([]);
  const [questionNum, setQuestionNum] = useState(1);
  const [questionTime, setQuestionTime] = useState(60);  // Change this once you can access time from DB
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/question/all')
    .then(res => res.json())
    .then(
      (result) => {
        setQuestionBank(result);
        setUserAnswers(Array.apply(null, Array(result.length)));
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }, [])

  const nextQuestion = () => {
    console.log(userAnswers); // for debugging
    if (questionNum < questionBank.length) {
      setQuestionNum(questionNum + 1);
      setQuestionTime(60);  // Change this once you can access time from DB
      return true;
    } else {
      alert("No more questions!");
      return false;
    }
  };

  const submitAnswer = (event) => {
    // if (questionTypeBank[questionNum - 1] === "entry") {
    //   event.preventDefault(); // Prevent form entry submission when pressing enter
    // }
    let answers = userAnswers;
    answers[questionNum - 1] = [getCurrentQuestion()._id, event.target.value];
    setUserAnswers(answers);
  };

  const getCurrentQuestion = () => {
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

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    startTimer();
    return (
      <div className="test">
        <TimerDisplay seconds={questionTime} />

        <Question
          type={'multichoice'}
          questionImage={getCurrentQuestion().image}
          text={getCurrentQuestion().description}
          answers={getCurrentQuestion().answer}
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
  }
};

export default Test;

// // ----------- Local Question Importing

// // Function to get all images from a folder as an array.
// // Array order corresponds to folder order (question is last).
// function importAll(r) {
//   let images = [];
//   r.keys().map((item, index) => {
//     images.push(r(item));
//   });
//   return images;

//   ////Use these line if you want to access each image using the file name.
//   //let images = {};
//   //r.keys().map((item, index) => { images[item.replace('./','')] = r(item); });
// }
// const images = importAll(
//   require.context(
//     "../assets/questions/perception1",
//     false,
//     /\.(png|jpe?g|svg)$/
//   )
// );
// const images2 = importAll(
//   require.context(
//     "../assets/questions/perception4",
//     false,
//     /\.(png|jpe?g|svg)$/
//   )
// );
// const images3 = importAll(
//   require.context(
//     "../assets/questions/perception12",
//     false,
//     /\.(png|jpe?g|svg)$/
//   )
// );
