import "../styles/Test.css";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import TimerDisplay from "../components/TimerDisplay";
import Timer from "../components/Timer";
import Question from "../components/Question";
import QuestionNavigation from "../components/QuestionNavigation";
import MatchingGame from "../components/MatchingGame/MatchingGame";
import PatternGame from "../components/PatternGame/PatternGame";
import axios from "axios";

const Test = (props) => {
  const { userData } = props;
  const Ref = useRef(null); // Used for countdown timer
  const [questionBank, setQuestionBank] = useState([]);
  const [questionTimeBank, setQuestionTimeBank] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For radio button reset on question change
  const [allowBackTraversal, setAllowBackTraversal] = useState(null);

  const url = "http://localhost:3001/api/test/getquestions";
  // const testId = "6319abdf2d143b5bfa3de54a"; // Use values from props later.
  // const testId = "6322b155323d447d6c5f7eb6";  // Memory games included
  const testId = "632efea0a6069a23596d3347"; // Non-linear
  const data = {
    tId: testId,
    shuffleQuestions: false,
    shuffleAnswers: false,
  };

  // Get test question data from backend API.
  useEffect(() => {
    axios.post(url, data).then(
      (res) => {
        console.log(res);
        setQuestionBank(res.data.questions);
        setQuestionTimeBank(res.data.times);
        setAllowBackTraversal(res.data.allowBackTraversal);
        if (res.data.allowBackTraversal) {
          setTimeLeft(res.data.totalTime);
        } else {
          setTimeLeft(res.data.times[currentQuestion - 1]);
        }
        
        let defaultAns = [];
        for (const q of res.data.questions) {
          defaultAns.push({ qId: q.id, aId: null, value: null });
        }
        setUserAnswers(defaultAns);
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  const nextQuestion = () => {
    console.log(userAnswers); // for debugging
    if (currentQuestion < questionBank.length) {
      setSelectedAnswer(userAnswers[currentQuestion].aId);
      setCurrentQuestion(currentQuestion + 1);
      if (!allowBackTraversal) {
        setTimeLeft(questionTimeBank[currentQuestion]);
      }
      return;
    } else {
      finishTest();  // No more questions.
    }
  };

  const previousQuestion = () => {
    console.log(userAnswers); // for debugging
    
    if (currentQuestion > 1 && allowBackTraversal) {
      setSelectedAnswer(userAnswers[currentQuestion - 2].aId);
      setCurrentQuestion(currentQuestion - 1);
      if (!allowBackTraversal) {
        setTimeLeft(questionTimeBank[currentQuestion]);
      }
    }
  }

  const finishTest = () => {
    if (userData.name) {
      // Create answer in DB if user logged in
      let testData = {
        tId: testId,
        sId: userData.name,
        answers: userAnswers,
      };
      axios.post("http://localhost:3001/api/answer", testData).then(
        window.location.replace(`http://localhost:3000/results/${testId}/${userData.name}`)
      );
    } else {
      alert("Test Finished. You are not logged in, so your results wont be saved.")
      // window.location.href(`http://localhost:3000/`);
    }
  }

  const submitAnswer = (event) => {
    // if (questionTypeBank[questionNum - 1] === "entry") {
    //   event.preventDefault(); // Prevent form entry submission when pressing enter
    // }
    let answers = userAnswers;
    answers[currentQuestion - 1].aId = event.target.value;
    setSelectedAnswer(event.target.value);
    setUserAnswers(answers);
  };

  const submitAnswerValue = (value) => {
    // For memory game
    let answers = userAnswers;
    answers[currentQuestion - 1].value = value;
    setSelectedAnswer(true);
    setUserAnswers(answers);
  }

  const getCurrentQuestion = () => {
    return questionBank[currentQuestion - 1];
  };

  const timeCountDown = () => {
    if (timeLeft <= 0) {
      clearInterval(Ref.current);
      if (allowBackTraversal) {
        finishTest();
      } else {
        nextQuestion();
      }
    } else {
      setTimeLeft(timeLeft - 1);
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
    return <div>Loading Test...</div>;
  } else {  
    // Test loaded successfully
    let testQuestion;
    startTimer();
    if (getCurrentQuestion().category === "Spatial Memory") {
      if (!allowBackTraversal) {
        clearInterval(Ref.current)  // Stop timer if the test is linear.
      }
      if (getCurrentQuestion().title === "MatchingGame") {
        testQuestion = <MatchingGame
            timeAllowed={questionTimeBank[currentQuestion - 1]}
            submit={submitAnswerValue}
            next={nextQuestion}
          />
      }
      else if (getCurrentQuestion().title === "PatternGame") {
        testQuestion = <PatternGame 
          timeAllowed={questionTimeBank[currentQuestion - 1]}
          submit={submitAnswerValue}
          next={nextQuestion}
        />
      }
    } else {
      testQuestion = <Question
          type={"multichoice"} // Change when the DB has question type.
          questionImage={getCurrentQuestion().image}
          text={getCurrentQuestion().description}
          answers={getCurrentQuestion().answer}
          submit={submitAnswer}
          selected={selectedAnswer}
        />
    }
    
    
    return (
      <div className="test">
        { getCurrentQuestion().category === "Spatial Memory" ? null : 
          <TimerDisplay seconds={timeLeft} />
        }
        
        {allowBackTraversal && currentQuestion != 1 ? 
          <button
            className="test__previous"
            onClick={() => previousQuestion()}
            title="Previous Question"
          >
            <FaCaretLeft size={60} />
          </button>
          : null
        }

        {testQuestion}

        <div className="test__progress" title="Progress">
          {currentQuestion} / {questionBank.length}
        </div>

        {selectedAnswer === null && !allowBackTraversal ? null : ( // Hide next button if no answer selected
          <button
            className="test__next"
            onClick={() => nextQuestion()}
            title="Next Question"
          >
            <FaCaretRight size={60} />
          </button>
        )}

        {allowBackTraversal ? 
        <QuestionNavigation 
          numberOfQuestions={questionBank.length}
          onClick={setCurrentQuestion}
        /> 
        : null}

        <Timer
          questionTime={ allowBackTraversal ? 
            questionTimeBank.reduce((partialSum, a) => partialSum + a, 0) :
            questionTimeBank[currentQuestion - 1]}
          timeLeft={timeLeft}
        />
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
