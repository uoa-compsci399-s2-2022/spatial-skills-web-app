import '../styles/Test.css';
import React, { useState, useRef, useEffect } from 'react';


class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionNum: 1,
            questionTime: 10,
        };
        this.questionBank = [images, images2];
    }

    nextQuestion(i) {
        if (i < this.questionBank.length) {
            this.setState({
                questionNum: this.state.questionNum + 1,
            })
            return;
        } else {
            alert("No more questions!");
        }
    }

    render() {
        return (
            <div className='test'>
                <TestContent question={this.questionBank[this.state.questionNum - 1]}/>
                <NextButton onClick={() => this.nextQuestion(this.state.questionNum)}/> 
                
                <TestProgress current={this.state.questionNum} total={this.questionBank.length}/>
                <TestTimer seconds={this.state.questionTime} onFinish={() => this.nextQuestion(this.state.questionNum)}/>
            </div>
        )
    }
}


class NextButton extends React.Component {
    render() {
        return (
            <button onClick={this.props.onClick}>Next</button>
        )
    }
}

function TestProgress(props) {
    return (
        <div>
            Question {props.current} / {props.total}
        </div>
    )
}

class TestContent extends React.Component {
    render() {
        return (
            <div className='test__content'>
                <Question question={this.props.question}/>
                <Answer question={this.props.question}/>
            </div>
        )
    }
}

const TestTimer = () => {
    const Ref = useRef(null);
    // The state for our timer
    const [timer, setTimer] = useState('00:00');
  
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }
  
    const startTimer = (e) => {
        let { total, minutes, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        } else {
            this.onFinish();
        }
    }
  
    const clearTimer = (e) => {
        setTimer('00:10');
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
  
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline;
    }
  
    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);
  
    const onClickReset = () => {
        clearTimer(getDeadTime());
    }
  
    return (
        <div className="timer">
            {timer}
        </div>
    )
}


class Question extends React.Component {
    renderQuestionImage() {
        const image = this.props.question[this.props.question.length - 1]
        return image;
    }

    render() {
        // Question text doesn't change currently.
        return (
            <div className='test__question'>
                <img src={this.renderQuestionImage()} className='test__image' alt=''/>
                <p>Which of the following cubes can you make with these four pieces?</p>
            </div>
        )
    }
}

class Answer extends React.Component {
    renderMultiChoiceAnswers() {
        const answers = [];
        const labels = ["a", "b", "c", "d", "e"];
        for (var i = 0; i < this.props.question.length - 1; i++) {
            answers.push(
                <MultichoiceAnswer 
                    image={this.props.question[i]}
                    label={labels[i]}
                />
            );
        }
        return answers;
    }

    render() {  // Currently only allows multichoice answers. We should also make an entry type answer
        return (
            <form action={console.log("answer submit")} className='test__answers'>
                {this.renderMultiChoiceAnswers()}
            </form>
                
        )
    }
}

function MultichoiceAnswer(props) {
    return (
        <div className='answer__option'>
            <label for={props.label}><img src={props.image} alt=''/></label>
            <input type="radio" id={props.label} value={props.label} name="answer"/>
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
