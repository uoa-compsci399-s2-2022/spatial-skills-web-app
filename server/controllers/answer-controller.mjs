import Question from "../models/question.js";
import StudentAnswer from "../models/student-answer.js";
import Test from "../models/test.js";
import APIError from "../handlers/APIError.js";

const checkAnswer = async (qId, aId) => {
  const query = await Question.findById(qId).exec();

  if (query.category === "Spatial Memory") {
    return true;
  } else if (aId === null) {
    return false;
  }
  //Check if actual answer in question
  const aCheck = await query.answer.find((c) => c._id == aId);
  if (!aCheck) {
    throw new APIError("Could not find answer.", 400);
  }

  const trueAnswer = await query.answer.find((c) => c.trueAnswer);
  return trueAnswer.id == aId ? true : false;
};

const calcGrade = async (answers, tId) => {
  let grade = 0;
  const test = await Test.findById(tId).exec();
  for (let i = 0; i < answers.length; i++) {
    grade += (await checkAnswer(answers[i].qId, answers[i].aId))
      ? test.questions.find((q) => q.qId === answers[i].qId).grade
      : 0;
  }
  return grade;
};

const createStudentAnswer = async (req, res, next) => {
  let test, createdStudentAnswer, result, qCheck;

  try {
    test = await Test.findById(req.body.tId).exec();
  } catch (e) {
    return next(
      new APIError("Could not find test id for student answer.", 404)
    );
  }

  if (req.body.answers.length !== test.questions.length) {
    return next(
      new APIError(
        "Number of student answers does not match number of questions in test",
        400
      )
    );
  }

  for (let i = 0; i < req.body.answers.length; i++) {
    qCheck = test.questions.find((q) => q.qId === req.body.answers[i].qId);
    if (!qCheck) {
      return next(
        new APIError(
          "Questions for student answers do not match those in the test.",
          400
        )
      );
    }
  }

  try {
    createdStudentAnswer = new StudentAnswer({
      tId: req.body.tId,
      sId: req.body.sId,
      answers: await Promise.all(
        req.body.answers.map(async (sa) => ({
          qId: sa.qId,
          aId: sa.aId,
          value: sa.value,
          correct: await checkAnswer(sa.qId, sa.aId),
        }))
      ),
      grade: await calcGrade(req.body.answers, req.body.tId),
    });
    await createdStudentAnswer.validate();
  } catch (e) {
    return next(new APIError(e.message, 500));
  }

  try {
    result = await createdStudentAnswer.save();
  } catch (e) {
    return next(new APIError("Failed to save student answer.", 500));
  }

  try {
    // Save in test object
    test.studentAnswers.splice(0, 0, createdStudentAnswer);
    await test.save();
  } catch (e) {
    return next(
      new APIError("Failed to save student answer in test object.", 500)
    );
  }

  res.status(201).json(result);
};

const getAllStudentAnswers = async (req, res, next) => {
  const studentAnswers = await StudentAnswer.find().exec();
  res.json(studentAnswers);
};

const getStudentAnswerBytIdsId = async (req, res, next) => {
  const studentAnswer = await StudentAnswer.findOne({
    tId: req.body.tId,
    sId: req.body.sId,
  }).exec();
  if (!studentAnswer) {
    return next(new APIError("Could not find student answer.", 404));
  }

  // // Get full details of question and test.
  const qaIdArr = studentAnswer.answers.map((q) => q.qId);
  const questions = await Question.find({ _id: { $in: qaIdArr } }).exec();
  if (questions.length < qaIdArr.length) {
    return next(new APIError("Could not find all test questions.", 404));
  }

  const test = await Test.findById(req.body.tId).exec();
  let testMaxGrade = 0;
  let studentGrade = 0;
  let testQuestions = [];
  test.questions.forEach(q => { 
    testMaxGrade += q.grade;
    let question = questions.find(obj => obj._id == q.qId);  // Full question object
    let answer = studentAnswer.answers.find(ans => ans.qId == q.qId);  // Get student answer for question
    if (answer.correct) {
      studentGrade += q.grade;
    }
    testQuestions.push(
      {
        qId: q.qId,
        grade: q.grade,
        image: question.image,
        category: question.category,
        description: question.description,
        correct: answer.correct,
        value: answer.value,  // For memory / entry questions
      }
    )
  });

  const result = {
    tId: studentAnswer.tId,
    sId: studentAnswer.sId,
    testTitle: test.title,
    testCreator: test.creator,
    testMaxGrade: testMaxGrade,
    studentGrade: studentGrade,
    testQuestions: testQuestions,
  }

  res.status(200).json(result);
};

export { createStudentAnswer, getAllStudentAnswers, getStudentAnswerBytIdsId };
