import '../styles/Test.css';
import React, { useState, useRef } from 'react';


const Test = (props) => {
    const Ref = useRef(null);   // Used for timer
    const questionBank = [images, images2]  // Local questions. Use parsed props eventually
    const questionTimeBank = [5, 10]
    const [questionNum, setQuestionNum] = useState(1);
    const [questionTime, setQuestionTime] = useState(questionTimeBank[questionNum - 1]);
    const [userAnswers, setUserAnswers] = useState(Array.apply(null, Array(questionBank.length)));

    const nextQuestion = () => {
        console.log("Answers: " + userAnswers);  // for debugging
        if (questionNum < questionBank.length) {
            setQuestionNum(questionNum + 1);
            setQuestionTime(questionTimeBank[questionNum]);
            return true;
        } else {
            alert("No more questions!");
            return false;
        }
    }

    const submitAnswer = event => {
        let answers = userAnswers;
        answers[questionNum - 1] = event.target.value;
        setUserAnswers(answers);
    };

    const getCurrentQuestion = () => {
        return questionBank[questionNum - 1];
    }

    const timeCountDown = () => {
        if (questionTime <= 0) {
            if (!nextQuestion()) {
                clearInterval(Ref.current);
            }
        } else {
            setQuestionTime(questionTime - 1);
        }
    }

    const startTimer = () => {
        if (Ref.current) {
            clearInterval(Ref.current);
        }
        const id = setInterval(() => {timeCountDown()}, 1000);
        Ref.current = id;
    }
 
    startTimer();

    return (
        <div className='test'>
            <div className='test__content'>
                <Question question={getCurrentQuestion()}/>
                <Answer question={getCurrentQuestion()} submit={submitAnswer}/>
            </div>
            <NextButton onClick={() => nextQuestion(questionNum)}/> 
            
            <TestProgress current={questionNum} total={questionBank.length}/>
            <TimerDisplay seconds={questionTime}/>
        </div>
    )
}


const TimerDisplay = (props) => {
    const formatTime = (secs) => {
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        minutes = minutes > 9 ? minutes : '0' + minutes;
        seconds = seconds > 9 ? seconds : '0' + seconds;
        return { minutes, seconds };
    }

    const time = formatTime(props.seconds);
    return (
        <div>
            Time Left: {time.minutes} : {time.seconds}
        </div>
    );
}

const NextButton = (props) => {
    return (
        <button onClick={props.onClick}>Next</button>
    )
}

const TestProgress = (props) => {
    return (
        <div>
            Question {props.current} / {props.total}
        </div>
    )
}

const Question = (props) => {
    const renderQuestionImage = () => {
        const image = props.question[props.question.length - 1]
        return image;
    }

    // Question text doesn't change currently.
    return (
        <div className='test__question'>
            <img src={renderQuestionImage()} className='test__image' alt=''/>
            <p>Question Text Lorem Ipsum</p>
        </div>
    )

}

const Answer = (props) => {
    const renderMultiChoiceAnswers = () => {
        const answerChoices = [];
        const labels = ["a", "b", "c", "d", "e"];
        for (var i = 0; i < props.question.length - 1; i++) {
            answerChoices.push(
                <MultichoiceAnswer 
                    image={props.question[i]}
                    label={labels[i]}
                    submit={props.submit}
                />
            );
        }
        return answerChoices;
    }

    return (
        <form className='test__answers'>
            {renderMultiChoiceAnswers()}
        </form>
    )
}

const MultichoiceAnswer = (props) => {
    return (
        <div className='answer__option'>
            <label for={props.label}><img src={props.image} alt=''/></label>
            <input type="radio" id={props.label} value={props.label} name="answer" onChange={props.submit}/>
        </div>
    )
}


export default Test;


// ----------- Local Question Importing

// Function to get all images from a folder as an array.
// Array order corresponds to folder order (question is last).
function importAll(r) {
    let images = [];
    r.keys().map((item, index) => { images.push(r(item)); });
    return images;

    ////Use these line if you want to access each image using the file name.
    //let images = {};
    //r.keys().map((item, index) => { images[item.replace('./','')] = r(item); });
}
const images = importAll(require.context('../assets/questions/perception1', false, /\.(png|jpe?g|svg)$/));  // ans = c
const images2 = importAll(require.context('../assets/questions/perception4', false, /\.(png|jpe?g|svg)$/));
