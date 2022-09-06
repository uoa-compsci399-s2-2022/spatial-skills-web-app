import '../styles/Test.css';
import React, { useState, useRef } from 'react';
import { FaCaretRight } from 'react-icons/fa';  // https://react-icons.github.io/react-icons
import TimerDisplay from '../components/TimerDisplay';

const Test = (props) => {
    const Ref = useRef(null);   // Used for timer
    const questionBank = [images, images2, images3];  // Local questions. Use parsed props eventually
    const questionTimeBank = [13, 120, 120];
    const questionTypeBank = ['multichoice', 'multichoice', 'entry'];
    const questionTextBank = ['Which of the following cubes can you make with these four pieces?',
                            'What comes next in the pattern?', 'How many triangles are there in this picture?'];

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
        if (questionTypeBank[questionNum - 1] === 'entry') {
            event.preventDefault();  // Prevent form entry submission when pressing enter
        }
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
            <div className='test__left-bar'>
                <TimerDisplay seconds={questionTime}/>      
            </div>

            <div className='test__content'>
                <Question question={getCurrentQuestion()} />
                <h2>{questionTextBank[questionNum - 1]}</h2>
                <Answer question={getCurrentQuestion()} type={questionTypeBank[questionNum - 1]} submit={submitAnswer}/>
            </div>

            <div className='test__right-bar'>
                <div className='test__progress' title='Progress'>
                    {questionNum} / {questionBank.length}
                </div>
                <button className='test__next' onClick={() => nextQuestion()} title="Next Question">
                    <FaCaretRight size={60}/>
                </button>
                <div></div>
            </div>

        </div>
    )
}


const Question = (props) => {
    const renderQuestionImage = () => {
        const image = props.question.at(-1);
        return image;
    }

    return (
        <div className='test__question'>
            <img src={renderQuestionImage()} className='test__image' alt=''/>
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
                    key={labels[i]}
                />
            );
        }
        return answerChoices;
    }

    // const renderMultiChoiceAnswers = () => {
    //     const labels = ["a", "b", "c", "d", "e"];
    //     return labels.map((index) =>
    //     <MultichoiceAnswer 
    //            image={props.question[index]} 
    //            label={labels[index]} 
    //            submit={props.submit} 
    //            key={labels[index]} 
    //        />
    //    )
    // }

    const renderTextEntryAnswer = () => {
        return <TextEntryAnswer 
                    label={"answer"}
                    submit={props.submit}
                />
    }

    let answers;
    if (props.type === "multichoice") {
        answers = renderMultiChoiceAnswers();
    } else if (props.type === "entry") {
        answers = renderTextEntryAnswer();
    }

    return (
        <form className='test__answers' onSubmit={props.submit} autoComplete="off">
            {answers}
        </form>
    )
}

const MultichoiceAnswer = (props) => {
    return (
        <div className='answer__choice'>
            <label htmlFor={props.label}><img src={props.image} alt=''/></label>
            <input type="radio" id={props.label} value={props.label} name="answer" onChange={props.submit}/>
        </div>
    )
}

const TextEntryAnswer = (props) => {
    return (
        <div className='answer__text-entry'>
            <label htmlFor={props.label}></label>
            <input 
                type="text" 
                id={props.label} 
                placeholder="Enter Answer" 
                autoComplete="off" name="answer" onChange={props.submit}/>
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
const images = importAll(require.context('../assets/questions/perception1', false, /\.(png|jpe?g|svg)$/));
const images2 = importAll(require.context('../assets/questions/perception4', false, /\.(png|jpe?g|svg)$/));
const images3 = importAll(require.context('../assets/questions/perception12', false, /\.(png|jpe?g|svg)$/));
