import Test from "../models/test.js";
import TestOut from "../models/test-out.js";
import QuestionOut from "../models/question-out.js";
import Question from "../models/question.js";
import APIError from "../handlers/APIError.js";

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

  try {
    await createdTest.validate();
  } catch (e) {
    return next(new APIError("Invalid or missing inputs.", 400));
  }

  let result;
  try {
    result = await createdTest.save();
  } catch (e) {
    return next(new APIError("Could not save test.", 500));
  }

  res.status(201).json(result);
};

const getAllTests = async (req, res, next) => {
  const tests = await Test.find().exec();
  res.json(tests);
};

const getTestById = async (req, res, next) => {
  let test;
  try{
    test = await Test.findById(req.params.tid).exec();
    if (!test){
      throw new Error;
    }
  } catch(e) {
    return next(new APIError("Test not found.", 404));
  }
  const testOut = new TestOut(test);
  res.json(testOut);
};

const getQuestionsBytId = async (req, res, next) => {
  let test;
  try{
    test = await Test.findById(req.body.tId).exec();
  } catch(e) {
    return next(new APIError("Test not found.", 404));
  }

  const qidArr = test.questions.map((q) => q.qId);

  const questions = await Question.find({ _id: { $in: qidArr } }).exec();
  if (questions.length < qidArr.length){
    return next(new APIError("Could not find all test questions.", 404));
  }

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
