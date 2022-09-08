import Test from "../models/test.js";
import TestOut from "../models/test-out.js";

const createCode = async () => {
  //Creates alphanumeric code of length 6
  let c = Math.random().toString(36).substring(2, 8);
  while (c.length !== 6 && !(await Test.findOne({ code: c }).exec())) {
    c = Math.random().toString(36).substring(2, 8);
  }
  return c;
};

const createTest = async (req, res, next) => {
  const createdTest = new Test({
    title: req.body.title,
    creator: req.body.creator,
    questions: req.body.questions.map((q) => ({
      qId: q.qId,
      time: q.time,
      grade: q.grade
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

export { createTest, getAllTests, getTestById };
