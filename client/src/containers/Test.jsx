import "../styles/Test.css";
import React, { useState, useRef } from "react";
import { FaCaretRight } from "react-icons/fa"; // https://react-icons.github.io/react-icons
import TimerDisplay from "../components/TimerDisplay";
import Question from "../components/Question";

// Currently can't set component state from async call to api endpoint.
const json = '[{"_id":"6316fb5c0df40a96f0a7f898","title":"Visualisation 1","description":"Which one of the following will be the final pattern after these actions occur?","image":"https://drive.google.com/uc?export=view&id=1Mv_LqaYIqhSOnF8Xv52sgNi3xx1cRz8n","answer":[{"image":"https://drive.google.com/uc?export=view&id=1vQXRikyfJuNS01t10UcR4b9EtkJkM2t3","trueAnswer":false,"_id":"6316fb5c0df40a96f0a7f899"},{"image":"https://drive.google.com/uc?export=view&id=1gn8YoW-ei93qO6sf4_9-OkQXsb13xF0i","trueAnswer":true,"_id":"6316fb5c0df40a96f0a7f89a"},{"image":"https://drive.google.com/uc?export=view&id=1oHt30XfBiAGJVe9BoQkj3qu6hAbGEdG9","trueAnswer":false,"_id":"6316fb5c0df40a96f0a7f89b"},{"image":"https://drive.google.com/uc?export=view&id=1NhYohDqmQKAEenxrh4eN8LuIWdNYE_Pc","trueAnswer":false,"_id":"6316fb5c0df40a96f0a7f89c"}],"category":"Spatial visualisation","__v":0},{"_id":"6316fce60df40a96f0a7f89e","title":"Visualisation 2","description":"Which one of the following will be the final pattern after these actions occur?","image":"https://drive.google.com/uc?export=view&id=1XUodgL7_coySUgP0f-WAN7ltFjNiHTj8","answer":[{"image":"https://drive.google.com/uc?export=view&id=1q7J5NLEkOkIpc5jIy_FFVgqVCRDlb2P6","trueAnswer":false,"_id":"6316fce60df40a96f0a7f89f"},{"image":"https://drive.google.com/uc?export=view&id=180OVyjKiS-Qa3uqiiPW32HmJFRffkSnH","trueAnswer":true,"_id":"6316fce60df40a96f0a7f8a0"},{"image":"https://drive.google.com/uc?export=view&id=13ki3YZ_CqDINofB-cJJR335F3AL_spLD","trueAnswer":false,"_id":"6316fce60df40a96f0a7f8a1"},{"image":"https://drive.google.com/uc?export=view&id=1pk5KxWshiM_TayahCplnH1q2OdOF7v7R","trueAnswer":false,"_id":"6316fce60df40a96f0a7f8a2"}],"category":"Spatial visualisation","__v":0},{"_id":"6316fdf10df40a96f0a7f8a4","title":"Rotation 1","description":"Which figure is identical to the first?","image":"https://drive.google.com/uc?export=view&id=1mVoRqyHb2sI5-baIUdjyW5I7y_3dKILu","answer":[{"image":"https://drive.google.com/uc?export=view&id=1hyDGIW4icIiier-BtTKsJ_cPFaXTQhux","trueAnswer":false,"_id":"6316fdf10df40a96f0a7f8a5"},{"image":"https://drive.google.com/uc?export=view&id=1dIqRF67CGUprZLAFV0TC4oU5Wug1Z9E5","trueAnswer":true,"_id":"6316fdf10df40a96f0a7f8a6"},{"image":"https://drive.google.com/uc?export=view&id=1LF92oITmiOVKkrPTL7KUYq-oF71CYCpJ","trueAnswer":false,"_id":"6316fdf10df40a96f0a7f8a7"},{"image":"https://drive.google.com/uc?export=view&id=1T5N5QBy-0dSn7H999q9Wu5urRxK4N-_Q","trueAnswer":false,"_id":"6316fdf10df40a96f0a7f8a8"}],"category":"Mental rotation","__v":0},{"_id":"6316ff1b0df40a96f0a7f8aa","title":"Rotation 2","description":"Which figure is identical to the first?","image":"https://drive.google.com/uc?export=view&id=1a7ZvXEEvc0dBU8aIBUf1ai2oCvn7zQen","answer":[{"image":"https://drive.google.com/uc?export=view&id=1BF3bfwkNueuMeKJdbmg8dcpm1AgMZUv5","trueAnswer":false,"_id":"6316ff1b0df40a96f0a7f8ab"},{"image":"https://drive.google.com/uc?export=view&id=1b8D9960_TXBkbuc0NP3bvDF0GaA3-346","trueAnswer":false,"_id":"6316ff1b0df40a96f0a7f8ac"},{"image":"https://drive.google.com/uc?export=view&id=1oWDPnM0h1xt0wISczFOTEgT37tsnvxCf","trueAnswer":true,"_id":"6316ff1b0df40a96f0a7f8ad"},{"image":"https://drive.google.com/uc?export=view&id=1rTnegsg8B77tIOXPzWsMeXdSGlR5N6D7","trueAnswer":false,"_id":"6316ff1b0df40a96f0a7f8ae"}],"category":"Mental rotation","__v":0},{"_id":"631701580df40a96f0a7f8b7","title":"Perception 1","description":"Which of the following cube can you make with these four pieces?","image":"https://drive.google.com/uc?export=view&id=1ex5HD1dEKaQNGUk1i_9WOL6fr3Nfglxv","answer":[{"image":"https://drive.google.com/uc?export=view&id=1Jd_CQOUE0IErBhAbly8Qsz66hMrIcYmb","trueAnswer":false,"_id":"631701580df40a96f0a7f8b8"},{"image":"https://drive.google.com/uc?export=view&id=1dmK7b2e1tJ7xQ1UGSAi5GZ21dN6KrTD1","trueAnswer":false,"_id":"631701580df40a96f0a7f8b9"},{"image":"https://drive.google.com/uc?export=view&id=19tHuG99zlSsD-47YhWdmPtmG03XisyhV","trueAnswer":true,"_id":"631701580df40a96f0a7f8ba"},{"image":"https://drive.google.com/uc?export=view&id=1D2-2Fwe_BrNWhYi4YCEs9OvEEFGPZFVW","trueAnswer":false,"_id":"631701580df40a96f0a7f8bb"}],"category":"Visual perception","__v":0}]'
const questionBank = JSON.parse(json);

const Test = (props) => {
  const Ref = useRef(null); // Used for timer

  const [questionNum, setQuestionNum] = useState(1);
  const [questionTime, setQuestionTime] = useState(60);  // Change this once you can access time from DB
  const [userAnswers, setUserAnswers] = useState(
    Array.apply(null, Array(questionBank.length))
  );

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
