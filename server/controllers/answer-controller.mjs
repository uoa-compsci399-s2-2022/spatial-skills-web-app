import Question from "../models/question.js";
import StudentAnswer from "../models/student-answer.js";
import Test from "../models/test.js";
import APIError from "../handlers/APIError.js";

//////////////////////////
//// HELPER FUNCTIONS ////
//////////////////////////


const gradeAnswer = async (answer) => {
  let q;
  try {
    q = await Question.findById(answer.qId).lean().exec();
    if (!q) {
      throw new Error();
    }
  } catch (e) {
    return next(new APIError(`Could not find question ${answer.qId}.`, 404));
  }

  let grade = 0;
  let value = 0;

  if (["DYNAMIC-MEMORY", "DYNAMIC-PATTERN"].includes(q.questionType)) {
    value = answer.value;
  } else if (
    ["MULTICHOICE-SINGLE", "MULTICHOICE-MULTI"].includes(q.questionType)
  ) {
    //Get sum of grades
    for (let i = 0; i < answer.aIds.length; i++) {
      try {
        grade =
          grade +
          parseFloat(
            q.multi.find((m) => m._id.toString() === answer.aIds[i]).grade
          );
      } catch (e) {
        throw new APIError(
          `Error getting grade for question ${answer.qId} and answer ${answer.aIds[i]}`
        );
      }
    }
  } else if (answer.textAnswer === q.answer) {
    grade = grade + q.textGrade;
  }

  let possibleGrade;
  let percentage;
  if (["DYNAMIC-MEMORY", "DYNAMIC-PATTERN"].includes(q.questionType)) {
    possibleGrade = null;
    percentage = null;
  } else if (["MULTICHOICE-SINGLE", "MULTICHOICE-MULTI"].includes(q.questionType)) {
    percentage = grade / parseFloat(q.totalMultiGrade) * 100;
    possibleGrade = parseFloat(q.totalMultiGrade);
  } else {
    percentage = grade / parseFloat(q.textGrade) * 100;
    possibleGrade = parseFloat(q.textGrade);
  }

  return {
    qId: answer.qId,
    questionType: q.questionType,
    aIds: answer.aIds,
    textAnswer: answer.textAnswer,
    value: value,
    grade: grade,
    percentage: percentage,
    possibleGrade: possibleGrade,
    questionTitle: q.title
  };
};

////////////////////////
//// MAIN FUNCTIONS ////
////////////////////////

const createStudentAnswer = async (req, res, next) => {
  let test, createdStudentAnswer, result, qCheck;

  try {
    test = await Test.findOne({ code: req.body.testCode }).exec();
    if (!test) {
      throw new Error();
    }
  } catch (e) {
    return next(new APIError("Could not find test for student answer.", 404));
  }

  if (!req.body.totalTimeTaken) {
    return next(new APIError("Missing inputs.", 400));
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
    qCheck = test.questions.includes(req.body.answers[i].qId);
    if (!qCheck) {
      return next(
        new APIError(
          "Questions for student answers do not match those in the test.",
          400
        )
      );
    }
  }

  let answers;
  try {
    answers = await Promise.all(
      req.body.answers.map(async (sa) => gradeAnswer(sa))
    );
  } catch (e) {
    return next(e);
  }

  const totalGrade = answers.reduce((tot, a) => {
    return tot + parseFloat(a.grade==null?0:a.grade);
  }, 0);

  const totalPossibleGrade = answers.reduce((tot, a) => {
    return tot + parseFloat(a.possibleGrade==null?0:a.possibleGrade);
  }, 0);

  try {
    createdStudentAnswer = new StudentAnswer({
      testCode: req.body.testCode,
      studentName: req.name,
      answers: answers,
      totalGrade: totalGrade,
      totalPossibleGrade: totalPossibleGrade,
      totalPercentage:
        totalPossibleGrade && totalGrade
          ? (totalGrade / totalPossibleGrade) * 100
          : null,
      totalTimeTaken: req.body.totalTimeTaken,
    });
    await createdStudentAnswer.validate();
  } catch (e) {
    return next(new APIError("Could not create student answer", 400));
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
  // res.status(201).json(createdStudentAnswer);
};

const getAllStudentAnswers = async (req, res, next) => {
  const studentAnswers = await StudentAnswer.find().exec();
  res.json(studentAnswers);
};

const getStudentAnswerByCodeName = async (req, res, next) => {
  const studentAnswer = await StudentAnswer.findOne({
    testCode: req.body.testCode,
    studentName: req.body.studentName,
  }).lean().exec();
  if (!studentAnswer) {
    return next(new APIError("Could not find student answer.", 404));
  };

  let answersOut;
  try{
    answersOut  = await Promise.all(studentAnswer.answers.map(async (sa)=>{
      sa.question = await Question.findById(sa.qId).lean().exec();
      return sa;
    }))
  }catch(e){
    return next(new APIError("Could not find questions for student answer", 404));
  }
  
  studentAnswer.answers = answersOut;

  res.status(200).json(studentAnswer);
};



/////////////////////////////
//// DEPRECATED FUNCTIONS ///
/////////////////////////////

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
  test.questions.forEach((q) => {
    testMaxGrade += q.grade;
    let question = questions.find((obj) => obj._id == q.qId); // Full question object
    let answer = studentAnswer.answers.find((ans) => ans.qId == q.qId); // Get student answer for question
    if (answer.correct) {
      studentGrade += q.grade;
    }
    testQuestions.push({
      qId: q.qId,
      grade: q.grade,
      image: question.image,
      category: question.category,
      description: question.description,
      correct: answer.correct,
      value: answer.value, // For memory / entry questions
    });
  });

  const result = {
    tId: studentAnswer.tId,
    sId: studentAnswer.sId,
    testTitle: test.title,
    testCreator: test.creator,
    testMaxGrade: testMaxGrade,
    studentGrade: studentGrade,
    testQuestions: testQuestions,
  };

  res.status(200).json(result);
};


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


export { createStudentAnswer, getAllStudentAnswers, getStudentAnswerBytIdsId, getStudentAnswerByCodeName };
