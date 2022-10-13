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
  const timer = useRef(null); // Used for countdown timer
  const [questions, setQuestions] = useState([]);
  const [totalTime, setTotalTime] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(null); 
  const [allowBackTraversal, setAllowBackTraversal] = useState(null);
  const testCode = sessionStorage.getItem("code");
  
  // Load test data from backend API
  useEffect(() => {
    axiosAPICaller.get(`/test/code/${testCode}`).then(
      (res) => {
        console.log(res);
        setQuestions(res.data.questions);
        setTotalTime(res.data.totalTime.$numberDecimal);
        setAllowBackTraversal(res.data.allowBackTraversal);
        if (res.data.allowBackTraversal) {
          setTimeLeft(res.data.totalTime.$numberDecimal);
        } else {
          setTimeLeft(res.data.questions[0].totalTime.$numberDecimal);
          // setTimeLeft(10);
        }
        
        let defaultAns = [];
        for (const q of res.data.questions) {
          defaultAns.push({ qId: q.qId, questionType: q.questionType, aIds: [], textAnswer: null, value: null });
        }
        setUserAnswers(defaultAns);
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, [testCode]);

  // Timer for time taken.
  useEffect(() => {
    if (isLoaded) {
      timer.current = setInterval(() => {
        setTimeTaken((prevTime) => prevTime + 1);
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000);
    }
    return () => clearInterval(timer.current);
  }, [isLoaded, allowBackTraversal]);

  const nextQuestion = () => {
    if (questionNum < questions.length) {
      goToQuestion(questionNum + 1);
      if (!allowBackTraversal) {
        setTimeLeft(questions[questionNum].totalTime.$numberDecimal);
      }
      return;
    } else {
      finishTest();  // No more questions
    }
  };

  const previousQuestion = () => {
    if (questionNum > 1 && allowBackTraversal) {
      goToQuestion(questionNum - 1);
      if (!allowBackTraversal) {
        // They shouldn't be able to reach here (no back on linear test).
        setTimeLeft(getCurrentQuestion().totalTime.$numberDecimal);
      }
    }
  }

  const finishTest = () => {
    console.log("Already Submitted: ", submitted);
    if (!submitted) {
      
      if (userData.name) {
        // Create answer in DB if user logged in
        let testData = {
          testCode: testCode,
          studentName: userData.name,
          answers: userAnswers,
          totalTimeTaken: timeTaken
        };
        console.log(testData)
        
        axiosAPICaller.post("http://localhost:3001/api/answer/", testData)
        .then(setSubmitted(true))
        .then(window.location.href = `http://localhost:3000/`)
        
      } else {
        console.log("Test Finished, Not User Found");
        // window.location.href = `http://localhost:3000/`;
      }
    }
  }

  const submitAnswer = (event) => {
    let answers = userAnswers;
    let ans;
    switch (getCurrentQuestion().questionType) {
      case "TEXT":
        event.preventDefault();  // Prevent form entry submission when pressing enter
        answers[questionNum - 1].textAnswer = event.target.value;
        ans = event.target.value;
        break;

      case "MULTICHOICE-MULTI":
        let checked = document.querySelectorAll('input[type="checkbox"]:checked');
        let values = [];
        checked.forEach(ans => { values.push(ans.value) })
        answers[questionNum - 1].aIds = values;
        ans = values.length > 0;
        break;

      case "MULTICHOICE-SINGLE":
        answers[questionNum - 1].aIds = [event.target.value];
        ans = event.target.value;
        break;

      default:
        console.log(`Invalid question type ${getCurrentQuestion().questionType}`)
    }
    setCurrentAnswer(ans);
    setUserAnswers(answers);
  };

  const submitAnswerValue = (value) => {
    // For memory games
    let answers = userAnswers;
    answers[questionNum - 1].value = value;
    setCurrentAnswer(true);
    setUserAnswers(answers);
  }

  const getCurrentQuestion = () => {
    return questions[questionNum - 1];
  };

  const goToQuestion = (num) => {
    setQuestionNum(num);
    setCurrentAnswer(null);  // In the future, change this to conditionally render existing answer
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
        if (!submitted) {
          finishTest();
        }
        clearInterval(timer.current);
      } else {
        nextQuestion();
      }
    }

    let testQuestion = <Question
        question={getCurrentQuestion()}
        submit={submitAnswer}
        submitValue={submitAnswerValue}
        nextQuestion={nextQuestion}
        userAnswer={userAnswers[questionNum - 1]}
    />
    
    return (
      <div className="test">
        { 
          // Timer Display, mm:ss
          getCurrentQuestion().category === "MEMORY" && !allowBackTraversal ?
          null : 
          <TimerDisplay seconds={timeLeft} />
        }
        
        {
          // Previous Question Button
          allowBackTraversal && questionNum !== 1 ? 
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
          {questionNum} / {questions.length}
        </div>

        {
          // Next Question
          (!(currentAnswer) && !allowBackTraversal) ||
          (allowBackTraversal && questionNum === questions.length) ? 
          null :  // Hide next button if no answer selected
          <button
            className="test__next"
            onClick={() => nextQuestion()}
            title="Next Question"
          >
            <FaCaretRight size={60} />
          </button>
        }

        {
          allowBackTraversal ? 
          <QuestionNavigation 
            numberOfQuestions={questions.length}
            onClick={goToQuestion}
            answers={userAnswers}
            currentQuestion={questionNum}
          /> :
          null
        }


        {
          (getCurrentQuestion().category === "MEMORY" && !allowBackTraversal) || allowBackTraversal ?
          null :
          <Timer
            questionTime={ allowBackTraversal ? 
              totalTime :
              getCurrentQuestion().totalTime.$numberDecimal}
            timeLeft={timeLeft}
          /> 
        }


        {
          allowBackTraversal ?
          <button className="test__finish-button" onClick={finishTest}>
            Finish Test
          </button> :
          null
        }

      </div>
    );
  }
};

export default Test;