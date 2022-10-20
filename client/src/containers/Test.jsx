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
  const [started, setStarted] = useState(false);
  const [testDetails, setTestDetails] = useState({})
  const testCode = sessionStorage.getItem("code");
  
  // Disable enter key entirely, prevents next button from disappearing.
  window.addEventListener('keydown', function(e) { 
    if (e.key === "Enter") {
        e.preventDefault();
    }
  });

  // Load test data from backend API
  useEffect(() => {
    if (!userData.name) {
      // Redirect user if they aren't logged in (refreshed page).
      window.location.href = process.env.NODE_ENV === 'production'? process.env.REACT_APP_DOMAIN : `http://localhost:3000/`;
    }
    
    axiosAPICaller.get(`/test/code/${testCode}`).then(
      (res) => {
        console.log(res);
        setTestDetails({ title: res.data.title, creator: res.data.creator });
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
          defaultAns.push({ qId: q.qId, questionType: q.questionType, aIds: [], textAnswer: "", value: null });
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
    if (isLoaded && started) {
      timer.current = setInterval(() => {
        setTimeTaken((prevTime) => prevTime + 1);
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000);
    }
    return () => clearInterval(timer.current);
  }, [isLoaded, allowBackTraversal, started]);

  const startTest = () => {
    setStarted(true);
  }

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
        
        axiosAPICaller.post("/answer/", testData)
        .then(setSubmitted(true))
        .then(window.location.href = process.env.NODE_ENV === 'production'? `${process.env.REACT_APP_DOMAIN}/finish`:`http://localhost:3000/finish`)
        
      } else {
        console.log("Test Finished, Not User Found");
        window.location.href = process.env.NODE_ENV === 'production'? `${process.env.REACT_APP_DOMAIN}/finish`:`http://localhost:3000/finish`;
      }
    }
  }

  const openFinishModal = () => {
    let modal = document.getElementById("finish-modal");
    modal.style.display = "block";
  }

  const closeFinishModal = () => {
    let modal = document.getElementById("finish-modal");
    modal.style.display = "none";
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

    // Load test information page before starting the test
    if (!started) {
      return (
        <div className="test">
          <div className="test__start-screen">

            <div>
              <h1>{testDetails.title}</h1>
              <h2>Created by: {testDetails.creator}</h2>
            </div>

            <div className="test__details">
              <p>Number of Questions: {questions.length}</p>
              <p>Test Time: {
                allowBackTraversal ? totalTime / 60 : 
                // Sum of individual question time for linear test
                Math.round(
                  questions.map(q => parseInt(q.totalTime.$numberDecimal)).reduce((a, b) => a + b, 0) / 60
                )
              } minutes
              </p>
              { allowBackTraversal ? null : <p>Each question has an individual time limit</p>}
              <p>Traversal between questions {allowBackTraversal ? "enabled" : "disabled"}</p>
              
              {
                questions.map(q => q.category).includes("MEMORY") ? 
                <p>Interactive memory based games included</p> :
                null
              }
              <b><p>Note: do not refresh / change pages using the browser during the test!</p></b>
              <p>This will end your test early, without submission.</p>

            </div>

            <button className="test__start-button" onClick={startTest}>
              Start Test
            </button>
          </div>
        </div>
      )
    }

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
          // Next Question Button
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
          <button className="test__finish-button" onClick={openFinishModal} disabled={false}
            title="Finish Test"
          >
            Finish Test
          </button> :
          null
        }

        {
          <div className="finish-modal" id="finish-modal">
            <div className="modal__content">
              <h2 style={{padding: "2rem"}}>Do you want to end your test?</h2>

              <div className="modal__buttons">
                <button onClick={closeFinishModal} className="cancel-button">Cancel</button>
                <button onClick={finishTest} className="finish-button">Finish Test</button>
              </div>
            </div>
          </div>
        }

      </div>
    );
  }
};

export default Test;