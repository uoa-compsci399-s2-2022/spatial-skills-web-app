import Question from "../models/question.js";
import StudentAnswer from "../models/student-answer.js";
import Test from "../models/test.js";

const checkAnswer = async (qId, aId) => {
  const query = await Question.findById(qId).exec();
  const trueAnswer = await query.answer.find((c) => c.trueAnswer);
  return trueAnswer.id == aId ? true : false;
};

const createStudentAnswer = async (req, res, next) => {
  const test = await Test.findById(req.body.tId).exec();

  if (req.body.answers.length !== test.questions.length) {
    res.status(400).json({
      message:
        "Number of student answers does not match number of questions in test",
    });
    return;
  }
  //ADD ERROR CHECKING IF qID IN STUDENT ANSWER SAME AS IN TEST/ GENERAL ERROR TESTING

  const createdStudentAnswer = new StudentAnswer({
    tId: req.body.tId,
    sId: req.body.sId,
    answers: await Promise.all(
      req.body.answers.map(async (sa) => ({
        qId: sa.qId,
        aId: sa.aId,
        correct: await checkAnswer(sa.qId, sa.aId),
      }))
    ),
  });
  const result = await createdStudentAnswer.save();
  // Save in test object
  test.studentAnswers.splice(0, 0, createdStudentAnswer);
  await test.save();

  res.status(201).json(result);
};

const getAllStudentAnswers = async (req, res, next) => {
  const studentAnswers = await StudentAnswer.find().exec();
  res.json(studentAnswers);
};

export { createStudentAnswer, getAllStudentAnswers };
