const Question = (props) => {
  // const { type, questionImage, text, answers, selected } = props;
  const { question, submit, selected } = props;

  console.log(question);

  const renderMultiChoiceAnswers = () => {
    const answerChoices = [];
    for (let i = 0; i < question.multi.length; i++) {
      answerChoices.push(
        <div className="answer__choice" key={i}>
          <label htmlFor={i}>
            <img src={question.multi[i].image} alt="" />
          </label>
          <input
            type="radio"
            id={i}
            value={question.multi[i]._id}
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
        {question.questionType == "MULTICHOICE"
          ? renderMultiChoiceAnswers()
          : renderTextEntryAnswer()}
      </form>
    </>
  );
};

export default Question;
