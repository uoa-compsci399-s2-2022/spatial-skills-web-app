import '../styles/Test.css';
import React from 'react';


class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionBank: [images, images2],
            questionNum: 1,
        };
    }

    handleClick(i) {
        if (i < this.state.questionBank.length) {
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
                <TestContent question={this.state.questionBank[this.state.questionNum - 1]}/>
                <NextButton onClick={() => this.handleClick(this.state.questionNum)}/> 
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
            <div className='test__answers'>
                {this.renderMultiChoiceAnswers()}
            </div>
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
