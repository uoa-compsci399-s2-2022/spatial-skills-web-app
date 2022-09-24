class StudentAnswerOut {
  constructor(studentAnswer) {
    this.id = studentAnswer.id;
    this.tId = studentAnswer.tId;
    this.sId = studentAnswer.sId;
    this.answers = studentAnswer.answers.map((sa) => ({
      qId: sa.qId,
      aId: a.saId,
      correct: sa.correct,
    }));
  }
}

export default StudentAnswerOut;
