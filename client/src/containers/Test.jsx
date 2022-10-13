import "../styles/Test.css";
import React, { useState, useRef, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import TimerDisplay from "../components/TimerDisplay";
import Timer from "../components/Timer";
import Question from "../components/Question";
import QuestionNavigation from "../components/QuestionNavigation";
import axiosAPICaller from "../services/api-service.mjs";

const Test = (props) => {
  const { userData } = props;
  const Ref = useRef(null); // Used for countdown timer
  const [questions, setQuestions] = useState([]);
  const [totalTime, setTotalTime] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For radio button reset on question change
  const [allowBackTraversal, setAllowBackTraversal] = useState(null);
  const testCode = sessionStorage.getItem("code");
  
  // Load test data from backend API
  useEffect(() => {
    axiosAPICaller.get(`/test/code/${testCode}`).then(
      (res) => {
        console.log(res);
        // setTestId(res.data.tId);
        setQuestions(res.data.questions);
        setTotalTime(res.data.totalTime.$numberDecimal);
        setAllowBackTraversal(res.data.allowBackTraversal);
        if (res.data.allowBackTraversal) {
          setTimeLeft(res.data.totalTime.$numberDecimal);
        } else {
          setTimeLeft(res.data.questions[0].totalTime.$numberDecimal);
        }
        
        let defaultAns = [];
        for (const q of res.data.questions) {
          defaultAns.push({ qId: q.qId, questionType: q.questionType, aIds: [], textAnswer: null, value: null });
        }
        setUserAnswers(defaultAns);
        setIsLoaded(true);
        setTimerOn(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [testCode]);

  // Timer for time taken.
  // useEffect(() => {
  //   Ref.current = setInterval(() => timeCountDown(), 1000);

  //   return () => clearInterval(Ref.current);
  // }, );

  useEffect(() => {
    let interval = null;

    if (isLoaded) {
      if (timerOn) {
        interval = setInterval(() => {
          setTimeTaken((prevTime) => prevTime + 1);
          if (!(getCurrentQuestion().category === "MEMORY" && !allowBackTraversal)) {
            setTimeLeft((prevTime) => prevTime - 1)
          }
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [isLoaded, timerOn, allowBackTraversal]);

  console.log(timeLeft, timeTaken);

  const timeCountDown = () => {
    if (isLoaded) {
      // if (Ref.current) {
      //   clearInterval(Ref.current);
      // }
      if ((getCurrentQuestion().category === "MEMORY" && !allowBackTraversal)) {
        if (timeLeft <= 0) {
          if (allowBackTraversal) {
            finishTest();
            clearInterval(Ref.current);
          } else {
            nextQuestion();
          }
        } else {
          setTimeTaken(timeTaken + 1);
          setTimeLeft(timeLeft - 1);
        }
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      goToQuestion(currentQuestion + 1);
      if (!allowBackTraversal) {
        setTimeLeft(questions[currentQuestion].totalTime.$numberDecimal);
      }
      return;
    } else {
      finishTest();  // No more questions
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 1 && allowBackTraversal) {
      goToQuestion(currentQuestion - 1);
      if (!allowBackTraversal) {
        // They shouldn't be able to reach here (no back on linear test).
        setTimeLeft(getCurrentQuestion().totalTime.$numberDecimal);
      }
    }
  }

  const finishTest = () => {
    if (userData.name) {
      // Create answer in DB if user logged in
      let testData = {
        testCode: testCode,
        studentName: userData.name,
        answers: userAnswers,
      };
      console.log(testData)
      axiosAPICaller.post("http://localhost:3001/api/answer/", testData).then(
        // window.location.replace(`http://localhost:3000/results/${testId}/${userData.name}`)
        console.log("Answer Submitted")
      );
      
    } else {
      alert("Test Finished. You are not logged in, so your results wont be saved.")
      // window.location.href(`http://localhost:3000/`);
    }
  }

  const submitAnswer = (event) => {
    let answers = userAnswers;
    switch (getCurrentQuestion().questionType) {
      case "TEXT":
        event.preventDefault();  // Prevent form entry submission when pressing enter
        answers[currentQuestion - 1].textAnswer = event.target.value;
        console.log(event.target.value);
        break;
      case "MULTICHOICE-MULTI":
        let checked = document.querySelectorAll('input[type="checkbox"]:checked');
        let values = [];
        checked.forEach(ans => { values.push(ans.value) })
        console.log(values)
        answers[currentQuestion - 1].aIds = values;
        break;
      case "MULTICHOICE-SINGLE":
        answers[currentQuestion - 1].aIds = [event.target.value];
        console.log(event.target.value);
        break;
      default:
        console.log(`Invalid question type ${getCurrentQuestion().questionType}`)
    }
    setSelectedAnswer(event.target.value);
    setUserAnswers(answers);
  };

  const submitAnswerValue = (value) => {
    // For memory games
    let answers = userAnswers;
    answers[currentQuestion - 1].value = value;
    setSelectedAnswer(true);
    setUserAnswers(answers);
  }

  const getCurrentQuestion = () => {
    return questions[currentQuestion - 1];
  };

  const goToQuestion = (num) => {
    setCurrentQuestion(num);
    setSelectedAnswer(userAnswers[num - 1].aId);
    console.log(userAnswers); // for debugging
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading Test...</div>;
  } else {  
    // Test loaded successfully
    
    // Logic if time runs out
    if (timeLeft <= 0 && !(getCurrentQuestion().category === "MEMORY" && !allowBackTraversal)) {
      if (allowBackTraversal) {
        finishTest();
        clearInterval(Ref.current);
      } else {
        nextQuestion();
      }
    }

    let testQuestion = <Question
        question={getCurrentQuestion()}
        submit={submitAnswer}
        submitValue={submitAnswerValue}
        nextQuestion={nextQuestion}
        selected={selectedAnswer}
    />
    
    return (
      <div className="test">
        { 
          getCurrentQuestion().category === "MEMORY" && !allowBackTraversal ?
          null : 
          <TimerDisplay seconds={timeLeft} />
        }
        
        {
          allowBackTraversal && currentQuestion !== 1 ? 
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
          {currentQuestion} / {questions.length}
        </div>

        {
          !selectedAnswer && !allowBackTraversal ? 
          null : ( // Hide next button if no answer selected
          <button
            className="test__next"
            onClick={() => nextQuestion()}
            title="Next Question"
          >
            <FaCaretRight size={60} />
          </button>
        )}

        {
          allowBackTraversal ? 
          <QuestionNavigation 
            numberOfQuestions={questions.length}
            onClick={goToQuestion}
            answers={userAnswers}
            currentQuestion={currentQuestion}
          /> :
          null
        }
        {
          !(getCurrentQuestion().category === "MEMORY" && !allowBackTraversal) ?
          <Timer
            questionTime={ allowBackTraversal ? 
              totalTime :
              getCurrentQuestion().totalTime.$numberDecimal}
            timeLeft={timeLeft}
          /> :
          null
        }

      </div>
    );
  }
};

export default Test;
