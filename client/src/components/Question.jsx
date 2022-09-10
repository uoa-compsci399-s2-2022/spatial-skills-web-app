const Question = (props) => {
  const { type, questionImage, text, answers, selected } = props;

  const renderMultiChoiceAnswers = () => {
    const labels = ["a", "b", "c", "d", "e"];
    const answerChoices = [];
    // The images cannot be retrieved through their filename (array, not object)
    for (var i = 0; i < answers.length; i++) {
      answerChoices.push(
        <div className="answer__choice" key={labels[i]}>
          <label htmlFor={labels[i]}>
            <img src={answers[i].image} alt="" />
          </label>
          <input
            type="radio"
            id={labels[i]}
            value={answers[i].id}
            name="answer"
            onChange={props.submit}
            checked={selected === answers[i].id}
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
          onChange={props.submit}
        />
      </div>
    );
  };

  return (
    <>
      <div className="test__question">
        <img src={questionImage} alt="" className="test__image" />
      </div>

      <h2>{text}</h2>

      <form
        className="test__answers"
        onSubmit={props.submit}
        autoComplete="off"
      >
        {type === "multichoice"
          ? renderMultiChoiceAnswers()
          : renderTextEntryAnswer()}
      </form>
    </>
  );
};

export default Question;
