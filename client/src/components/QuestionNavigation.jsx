const QuestionNavigation = (props) => {
  const { numberOfQuestions, onClick, answers, currentQuestion } = props;

  const renderQuestionNavigation = () => {
    let questionSelectButtons = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      questionSelectButtons.push(
        <button
          className={`question-select__button button ${
            currentQuestion === i + 1 ? "button--filled" : "button--outlined"
          }`}
          onClick={() => onClick(i + 1)}
          title="Go to question"
          key={i + 1}
        >
          {i + 1}
        </button>
      );
    }
    return questionSelectButtons;
  };

  return (
    <div className="test__question-select">{renderQuestionNavigation()}</div>
  );
};

export default QuestionNavigation;
