import Test from "../models/test.js";
import TestOut from "../models/test-out.js";
import QuestionOut from "../models/question-out.js";
import Question from "../models/question.js";
import APIError from "../handlers/APIError.js";

//////////////////////////
//// HELPER FUNCTIONS ////
//////////////////////////

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

const validateQuestions = async (questions) => {
  let q;
  for (let i = 0; i < questions.length; i++) {
    try {
      q = await Question.findById(questions[i].qId).lean().exec();
      if (!q) {
        throw new Error();
      }
    } catch (e) {
      throw new APIError(`Could not find question ${questions[i].qId}`, 400);
    }

    if (q.questionType === "MULTICHOICE") {
      if (q.multi.length !== questions[i].multiGrades.length) {
        throw new APIError(
          `Answer array given for ${questions[i].qId} does not match actual answer array`,
          400
        );
      }

      for (let j = 0; j < questions[i].multiGrades.length; j++) {
        if (
          q.multi.filter(
            (a) => a._id.toString() === questions[i].multiGrades[j].aId
          ).length !== 1
        ) {
          throw new APIError(`Answer not found`, 400);
        }
      }
    }
  }
};

const questionOutAdmin = async (question) => {
  let adminQ;
  try {
    adminQ = await Question.findById(question.qId).lean().exec();
    if (!adminQ) {
      throw new Error();
    }
  } catch (e) {
    throw new APIError(`Could not find question ${question.qId}.`, 404);
  }
  question.title = adminQ.title;
  question.description = adminQ.description;
  question.image = adminQ.image;
  question.category = adminQ.category;
  question.questionType = adminQ.questionType;
  question.creator = adminQ.creator;
  question.citation = adminQ.citation;
  question.multi = adminQ.multi;
  question.numMulti = adminQ.numMulti;
  question.answer = adminQ.answer;
  question.size = adminQ.size;
  question.lives = adminQ.lives;
  question.seed = adminQ.seed;
  question.patternFlashTime = adminQ.patternFlashTime;
  question.randomLevelOrder = adminQ.randomLevelOrder;
  question.corsi = adminQ.corsi;
  question.reverse = adminQ.reverse;
  question.gameStartDelay = adminQ.gameStartDelay;
  question.selectionDelay = adminQ.selectionDelay;
  question.multiGrades.forEach((e) => {
    delete e._id;
  });
  delete question._id;
  return question;
};

const questionOutStudent = async (req, question) => {
  const studentQ = {};
  let adminQ;
  try {
    adminQ = await Question.findById(question.qId).lean().exec();
    if (!adminQ) {
      throw new Error();
    }
  } catch (e) {
    throw new APIError(`Could not find question ${question.qId}.`, 404);
  }

  const multi = req.body.shuffleAnswers
    ? FisherYatesShuffle(adminQ.multi)
    : adminQ.multi;
  multi.forEach((m) => {
    delete m.trueAnswer;
  });

  studentQ.title = adminQ.title;
  studentQ.description = adminQ.description;
  studentQ.image = adminQ.image;
  studentQ.category = adminQ.category;
  studentQ.questionType = adminQ.questionType;
  studentQ.creator = adminQ.creator;
  studentQ.citation = adminQ.citation;
  studentQ.multi = multi;
  studentQ.numMulti = adminQ.numMulti;
  studentQ.size = adminQ.size;
  studentQ.lives = adminQ.lives;
  studentQ.seed = adminQ.seed;
  studentQ.patternFlashTime = adminQ.patternFlashTime;
  studentQ.randomLevelOrder = adminQ.randomLevelOrder;
  studentQ.corsi = adminQ.corsi;
  studentQ.reverse = adminQ.reverse;
  studentQ.gameStartDelay = adminQ.gameStartDelay;
  studentQ.selectionDelay = adminQ.selectionDelay;
  studentQ.qId = adminQ._id;

  delete question._id;
  return studentQ;
};

const testOutAdmin = async (test) => {
  test.questions = await Promise.all(
    test.questions.map(async (q) => await questionOutAdmin(q))
  );
  return test;
};

const testOutStudent = async (req, test) => {
  const testOut = {};
  testOut.title = test.title;
  testOut.creator = test.creator;
  testOut.code = test.code;
  testOut.allowBackTraversal = test.allowBackTraversal;
  testOut.totalTime = test.totalTime;
  testOut.individualTime = test.individualTime;

  testOut.questions = await Promise.all(
    test.questions.map(async (q) => await questionOutStudent(req, q))
  );

  testOut.questions = req.body.shuffleQuestions
    ? FisherYatesShuffle(testOut.questions)
    : testOut.questions;

  return testOut;
};

////////////////////////
//// MAIN FUNCTIONS ////
////////////////////////

const createTest = async (req, res, next) => {
  if (req.body.allowBackTraversal && req.body.individualTime) {
    return next(
      new APIError("Cannot have individual time and backwards traversal.", 400)
    );
  }
  const createdTest = new Test({
    title: req.body.title,
    creator: req.name,
    questions: [],
    studentAnswers: [],
    published: false,
    allowBackTraversal:
      req.body.allowBackTraversal == null ? false : req.body.allowBackTraversal,
    totalTime: req.body.totalTime == null ? 0 : req.body.totalTime,
    code: await createCode(),
    individualTime:
      req.body.individualTime == null ? true : req.body.individualTime,
    shuffleAnswers:
      req.body.shuffleAnswers == null ? false : req.body.shuffleAnswers,
    shuffleQuestions:
      req.body.shuffleQuestions == null ? false : req.body.shuffleQuestions,
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

  // res.status(201).json(createdTest);
  res.status(201).json(result);
};

const getTestByCode = async (req, res, next) => {
  let test;
  try {
    test = await Test.findOne({ code: req.params.code }).lean().exec();
    if (!test) {
      throw new Error();
    }
  } catch (e) {
    return next(new APIError("Test not found.", 404));
  }

  //Can only access test if creator for admin or test permissions for students
  if (
    !(req.permissions.includes("admin") && req.name === test.creator) &&
    !(
      !req.permissions.includes("admin") &&
      req.permissions.includes(req.params.code)
    )
  ) {
    return next(new APIError("Forbidden.", 403));
  }

  //Different outputs depending on whether admin or student
  if (req.permissions.includes("admin")) {
    // res.json(await testOutStudent(req, test));
    res.json(await testOutAdmin(test));
  } else {
    if (!test.published) {
      return next(new APIError("Cannot do unpublished test.", 403));
    }
    res.json(await testOutStudent(req, test));
  }
};

const getMyTests = async (req, res, next) => {
  let tests;
  try {
    //lean to get plain old javascript object
    tests = await Test.find({ creator: req.name }).lean().exec();
    if (!tests) {
      throw new Error();
    }
  } catch (e) {
    return next(new APIError("No test not found.", 404));
  }

  const testsOut = await Promise.all(tests.map((t) => testOutAdmin(t)));
  res.json(testsOut);
};

const editTest = async (req, res, next) => {
  let test;
  try {
    test = await Test.findOne({
      creator: req.name,
      code: req.params.code,
    }).exec();
    if (!test) {
      throw new Error();
    }
  } catch (e) {
    return next(
      new APIError(
        "No test not found or user does not have permission to edit test.",
        404
      )
    );
  }

  if (test.published) {
    return next(new APIError("Cannot edit published test", 404));
  }

  if (req.body.allowBackTraversal && req.body.individualTime) {
    return next(
      new APIError("Cannot have individual time and backwards traversal.", 400)
    );
  }
  //Validate questions field
  if (req.body.questions) {
    try {
      await validateQuestions(req.body.questions);
    } catch (e) {
      return next(e);
    }
  }

  test.title = !req.body.title ? test.title : req.body.title;
  test.questions = !req.body.questions ? test.questions : req.body.questions;
  test.published = !req.body.published ? test.published : req.body.published;
  test.allowBackTraversal =
    req.body.allowBackTraversal == null
      ? test.allowBackTraversal
      : req.body.allowBackTraversal;
  test.individualTime =
    req.body.individualTime == null
      ? test.individualTime
      : req.body.individualTime;
  test.totalTime = !test.individualTime
    ? !req.body.totalTime
      ? test.totalTime
      : req.body.totalTime
    : req.body.questions.map((q) => q.time).reduce((total, t) => total + t, 0);

  try {
    await test.validate();
  } catch (e) {
    return next(new APIError("Invalid or missing inputs.", 400));
  }

  let result;
  try {
    result = await test.save();
  } catch (e) {
    return next(new APIError("Failed to save in database.", 500));
  }

  res.status(201).json(result);
};

const deleteTest = async (req, res, next) => {
  let test;
  try {
    test = await Test.findOne({ creator: req.name, code: req.params.code })
      .lean()
      .exec();
    if (!test) {
      throw new Error();
    }
  } catch (e) {
    return next(
      new APIError(
        "No test not found or user does not have permission to delete test.",
        404
      )
    );
  }

  try {
    await Test.findOneAndDelete({
      creator: req.name,
      code: req.params.code,
    }).exec();
  } catch (e) {
    return next(new APIError("Could not delete test", 400));
  }

  res.json({ message: "Successfully deleted test" });
};

/////////////////////////////
//// DEPRECATED FUNCTIONS ///
/////////////////////////////

//DEPRECATE IN FAVOUR OF get test by code enpoints
const getQuestionsBytId = async (req, res, next) => {
  //Can only access test if have admin or test permissions
  if (
    !req.permissions.includes("admin") &&
    !req.permissions.includes(req.body.tId)
  ) {
    return next(new APIError("Forbidden.", 403));
  }

  let test;
  try {
    test = await Test.findById(req.body.tId).exec();
  } catch (e) {
    return next(new APIError("Test not found.", 404));
  }

  const qidArr = test.questions.map((q) => q.qId);

  const questions = await Question.find({ _id: { $in: qidArr } }).exec();
  if (questions.length < qidArr.length) {
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

//DEPRECATE IN FAVOUR OF get test by code endpoints
const getTestById = async (req, res, next) => {
  //Can only access test if have admin or test permissions
  if (
    !req.permissions.includes("admin") &&
    !req.permissions.includes(req.params.tid)
  ) {
    return next(new APIError("Forbidden.", 403));
  }

  let test;
  try {
    test = await Test.findById(req.params.tid).exec();
    if (!test) {
      throw new Error();
    }
  } catch (e) {
    return next(new APIError("Test not found.", 404));
  }
  const testOut = new TestOut(test);
  res.json(testOut);
};

//DEPRECATE - functionality included in getTestByCode
const getQuestionsByCode = async (req, res, next) => {
  //Can only access test if have admin or test permissions
  if (
    !req.permissions.includes("admin") &&
    !req.permissions.includes(req.body.code)
  ) {
    return next(new APIError("Forbidden.", 403));
  }

  let test;
  try {
    test = await Test.findOne({ code: req.body.code }).exec();
  } catch (e) {
    return next(new APIError("Test not found.", 404));
  }

  const qidArr = test.questions.map((q) => q.qId);

  // Questions will be in order of creation date
  const questions = await Question.find({ _id: { $in: qidArr } }).exec();
  if (questions.length < qidArr.length) {
    return next(new APIError("Could not find all test questions.", 404));
  }
  // Sort the questions in the original order.
  var orderedQuestions = [];
  for (let i = 0; i < qidArr.length; i++) {
    let question = questions.find((q) => q._id == qidArr[i]);
    if (req.body.shuffleAnswers) {
      question.answer = FisherYatesShuffle(question.answer);
    }
    orderedQuestions.push(question);
  }

  let questionsOut = orderedQuestions.map((q) => new QuestionOut(q));
  if (req.body.shuffleQuestions) {
    questionsOut = FisherYatesShuffle(questionsOut);
  }
  const timeOut = questionsOut.map(
    (qo) => test.questions.find((q) => q.qId === qo.id).time
  );

  const combined = {
    questions: questionsOut,
    times: timeOut,
    allowBackTraversal: test.allowBackTraversal,
    // totalTime: test.totalTime,
    totalTime: timeOut.reduce((partialSum, a) => partialSum + a, 0), // Sum of question times
    tId: test._id,
  };
  res.json(combined);
};

//DEPRECATE in favour of get my tests
const getAllTests = async (req, res, next) => {
  const tests = await Test.find().exec();
  res.json(tests);
};

export {
  createTest,
  getAllTests,
  getTestById,
  getQuestionsBytId,
  getQuestionsByCode,
  getTestByCode,
  getMyTests,
  editTest,
  deleteTest,
};
