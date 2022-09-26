const QuestionNavigation = (props) => {
  const { numberOfQuestions, onClick, answers, currentQuestion } = props;

  const renderQuestionNavigation = () => {
    let questionSelectButtons = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      questionSelectButtons.push(
        <button 
          className="question-select__button"
          onClick={() => onClick(i+1)}
          title="Go to question"
          key={i + 1}
          style={{
            background: (answers[i].aId || answers[i].value) ? "var(--accent-color)" : null,
            outline: currentQuestion == i + 1 ? "1.5px solid var(--accent-color)" : null,
          }}
        >
          {i + 1}
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