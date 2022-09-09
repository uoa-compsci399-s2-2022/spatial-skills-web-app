import Test from "../models/test.js";
import TestOut from "../models/test-out.js";
import QuestionOut from "../models/question-out.js";
import Question from "../models/question.js";

const createCode = async () => {
  //Creates alphanumeric code of length 6
  let c = Math.random().toString(36).substring(2, 8);
  while (c.length !== 6 && !(await Test.findOne({ code: c }).exec())) {
    c = Math.random().toString(36).substring(2, 8);
  }
  return c;
};

const FisherYatesShuffle = (questions) => {
  let i = questions.length - 1;
  let ri, temp;

  while (i > 0) {
    ri = Math.floor(Math.random() * i);
    temp = questions[i];
    questions[i] = questions[ri];
    questions[ri] = temp;
    i--;
  }

  return questions;
};

const createTest = async (req, res, next) => {
  const createdTest = new Test({
    title: req.body.title,
    creator: req.body.creator,
    questions: req.body.questions.map((q) => ({
      qId: q.qId,
      time: q.time,
      grade: q.grade,
    })),
    studentAnswers: [],
    published: req.body.published,
    code: await createCode(),
  });
  const result = await createdTest.save();
  res.status(201).json(result);
};

const getAllTests = async (req, res, next) => {
  const tests = await Test.find().exec();
  res.json(tests);
};

const getTestById = async (req, res, next) => {
  const test = await Test.findById(req.params.tid).exec();
  const testOut = new TestOut(test);
  res.json(testOut);
};

const getQuestionsBytId = async (req, res, next) => {
  const test = await Test.findById(req.body.tId).exec();
  const qidArr = test.questions.map((q) => q.qId);
  const questions = await Question.find({ _id: { $in: qidArr } }).exec();
  let questionsOut = questions.map((q) => new QuestionOut(q));
  if (req.body.shuffle) {
    questionsOut = FisherYatesShuffle(questionsOut);
  }
  const timeOut = questionsOut.map(
    (qo) => test.questions.find((q) => q.qId === qo.id).time
  );
  const combined = { questions: questionsOut, times: timeOut };
  res.json(combined);
};

export { createTest, getAllTests, getTestById, getQuestionsBytId };
