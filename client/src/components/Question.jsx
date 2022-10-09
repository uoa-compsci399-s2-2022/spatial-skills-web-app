const Question = (props) => {
  // const { type, questionImage, text, answers, selected } = props;
  const { question, submit, selected } = props;

  const renderMultiChoiceAnswers = () => {
    const labels = ["a", "b", "c", "d", "e"];
    const answerChoices = [];
    // The images cannot be retrieved through their filename (array, not object)
    for (let i = 0; i < question.multi; i++) {
      answerChoices.push(
        <div className="answer__choice" key={labels[i]}>
          <label htmlFor={labels[i]}>
            <img src={question.image} alt="" />
          </label>
          <input
            type="radio"
            id={labels[i]}
            value={question._id}
            name="answer"
            onChange={submit}
            checked={selected === question.multi[i]._id}
          />
        </div>
      );
    }
    return answerChoices;
  };

  const renderTextEntryAnswer = () => {
    return (
      <div className="answer__text-entry">
        <label htmlFor="answer"></label>
        <input
          type="text"
          id="answer"
          placeholder="Answer"
          autoComplete="off"
          name="answer"
          onChange={submit}
        />
      </div>
    );
  };

  return (
    <>
      <div className="test__question">
        <img src={question.image} alt="" className="test__image" />
      </div>

      <h2>{question.description}</h2>

      <form
        className="test__answers"
        onSubmit={submit}
        autoComplete="off"
      >
        {question.questionType === "MULTICHOICE-MULTI"
          ? renderMultiChoiceAnswers()
          : renderTextEntryAnswer()}
      </form>
    </>
  );
};

export default Question;
