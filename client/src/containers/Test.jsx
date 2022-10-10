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
  // const [timerOn, setTimerOn] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // For radio button reset on question change
  const [allowBackTraversal, setAllowBackTraversal] = useState(null);
  const [testId, setTestId] = useState(null);
  
  // Load test data from backend API
  useEffect(() => {
    axiosAPICaller.get(`/test/code/${sessionStorage.getItem("code")}`).then(
      (res) => {
        console.log(res);
        setTestId(res.data.tId);
        setQuestions(res.data.questions);
        setTotalTime(res.data.totalTime.$numberDecimal);
        setAllowBackTraversal(res.data.allowBackTraversal);
        if (res.data.allowBackTraversal) {
          setTimeLeft(res.data.totalTime.$numberDecimal);
        } else {
          setTimeLeft(res.data.questions[0].time.$numberDecimal);
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
    if (currentQuestion < questions.length) {
      goToQuestion(currentQuestion + 1);
      if (!allowBackTraversal) {
        setTimeLeft(questions[currentQuestion].time.$numberDecimal);
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
        setTimeLeft(getCurrentQuestion().time.$numberDecimal);
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
      // axiosAPICaller.post("http://localhost:3001/api/answer", testData).then(
      //   // window.location.replace(`http://localhost:3000/results/${testId}/${userData.name}`)
      // );
    } else {
      alert("Test Finished. You are not logged in, so your results wont be saved.")
      // window.location.href(`http://localhost:3000/`);
    }
  }

  const submitAnswer = (event) => {
    // Updates answers whenever user selects / enters new answer
    let answers = userAnswers;
    if (getCurrentQuestion().questionType === "TEXT") {
      event.preventDefault();  // Prevent form entry submission when pressing enter
      answers[currentQuestion - 1].value = event.target.value;
    } 
    else {
      answers[currentQuestion - 1].aId = event.target.value;
    }
    setSelectedAnswer(event.target.value);
    setUserAnswers(answers);
  };

  const submitAnswerValue = (value) => {
    // For memory games where there is no answer ID
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
    
    if (getCurrentQuestion().category === "MEMORY" && !allowBackTraversal) {
      clearInterval(Ref.current);
    } 
    else {
      startTimer();
    }
    testQuestion = <Question
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
          !allowBackTraversal && getCurrentQuestion().category === "MEMORY" ?
          <Timer
            questionTime={ allowBackTraversal ? 
              totalTime :
              getCurrentQuestion().time.$numberDecimal}
            timeLeft={timeLeft}
          /> :
          null
        }
          
        

      </div>
    );
  }
};

export default Test;
