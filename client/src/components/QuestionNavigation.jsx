const QuestionNavigation = (props) => {
  const { numberOfQuestions, onClick } = props;


  const renderQuestionNavigation = () => {
    let questionSelectButtons = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      questionSelectButtons.push(
        <button 
          className="question-select__button"
          onClick={() => onClick(i+1)}
          title="Go to question"
          key={i + 1}
        >
          <p>{i + 1}</p>
        </button>
      )
    }
    return questionSelectButtons;
  }

  return (
    <div className="test__question-select">
      {renderQuestionNavigation()}
    </div>
  )
}

export default QuestionNavigation;