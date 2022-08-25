import questionImage from '../assets/questions/perception1.png'  // Temporary image

const Test = () => {
    return(
        <div className='test'>
            <div className='question'>
                <img src={questionImage} className='questionImage' alt=""/>
                <p>Which of the following cubes can you make with these four pieces?</p>
            </div>
            <div className='multichoiceAnswers'>
                <button>a</button>
                <button>b</button>
                <button>c</button>
                <button>d</button>
                <button>e</button>
            </div>

        </div>
        

    );
}

export default Test;