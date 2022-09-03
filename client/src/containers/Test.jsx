import '../styles/Test.css';
import React from 'react';


class Test extends React.Component {
    constructor(props) {
        super(props);
        this.questionBank = [images, images2];
        this.questionTimeBank = [10, 20]
        this.state = {
            questionNum: 1,
            questionTime: this.questionTimeBank[0],  // Remaining time
        };
        this.answers = Array.apply(null, Array(this.questionBank.length));
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    nextQuestion() {
        console.log("Answers: " + this.answers);  // for debugging
        if (this.state.questionNum < this.questionBank.length) {
            this.setState({
                questionNum: this.state.questionNum + 1,
                questionTime: this.questionTimeBank[this.state.questionNum],
            })
            return true;
        } else {
            alert("No more questions!");
            return false;
        }
    }

    submitAnswer = event => {
        const answer = event.target;
        this.answers[this.state.questionNum - 1] = event.target.value;
    };

    getCurrentQuestion() {
        return this.questionBank[this.state.questionNum - 1];
    }

    countDown() {
        this.setState({
            questionTime: this.state.questionTime - 1,
        });
        if (this.state.questionTime <= 0) {
            if (this.nextQuestion()) {

            } else {
                clearInterval(this.timer);
            }
        }
    }

    startTimer() {
        if (this.timer === 0 && this.state.questionTime > 0) {  // Timer === 0: timer has not been started yet
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    render() {
        this.startTimer();

        return (
            <div className='test'>
                <div className='test__content'>
                    <Question question={this.getCurrentQuestion()}/>
                    <Answer question={this.getCurrentQuestion()} submit={this.submitAnswer}/>
                </div>
                <NextButton onClick={() => this.nextQuestion(this.state.questionNum)}/> 
                
                <TestProgress current={this.state.questionNum} total={this.questionBank.length}/>
                <TimerDisplay seconds={this.state.questionTime}/>
            </div>
        )
    }
}



class TimerDisplay extends React.Component {
    secondsToTime(secs) {
        // Returns dictionary array of minutes + seconds.
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let time = {
            "m": minutes,
            "s": seconds
        };
        return time;
    }

    render() {
        return (
            <div>
                Time Left: {this.props.seconds} seconds
            </div>
        );
    }
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
    // Currently only allows multichoice answers. We should also make an entry type answer
    renderMultiChoiceAnswers() {
        const answerChoices = [];
        const labels = ["a", "b", "c", "d", "e"];
        for (var i = 0; i < this.props.question.length - 1; i++) {
            answerChoices.push(
                <MultichoiceAnswer 
                    image={this.props.question[i]}
                    label={labels[i]}
                    submit={this.props.submit}
                />
            );
        }
        return answerChoices;
    }

    render() {  
        return (
            <form className='test__answers'>
                {this.renderMultiChoiceAnswers()}
            </form>
                
        )
    }
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
