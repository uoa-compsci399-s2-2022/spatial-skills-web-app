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

export { createStudentAnswer, getAllStudentAnswers, getStudentAnswerByCodeName };
