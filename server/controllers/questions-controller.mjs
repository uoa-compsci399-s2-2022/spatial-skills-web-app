import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

import Question from "../models/question.js";
import QuestionOut from "../models/question-out.js";
import Test from "../models/test.js";
import APIError from "../handlers/APIError.js";
import { s3Client } from "../db/aws.js";

const REGION = "ap-southeast-2";
const bucketURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;

//////////////////////////
//// HELPER FUNCTIONS ////
//////////////////////////

const getFileDir4AWS = async (req) => {
  // Get unique name to store question in CDN
  let uuid;
  let duplicate = true;
  let fileDir = `${req.body.category}/${req.body.title}`;

  while (duplicate) {
    uuid = nanoid();
    try {
      await s3Client.send(
        new GetObjectCommand({
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
          Key: `${fileDir}-${uuid}/`,
        })
      );
    } catch (error) {
      if (error.Code === "NoSuchKey") duplicate = false;
      else {
        throw new APIError();
      }
    }
  }
  return `${fileDir}-${uuid}/`;
};

const createMCQ = async (req) => {
  const fKeys = Object.keys(req.files);

  // Atleast two answers and question
  if (fKeys.length < 3 || !fKeys.includes("question")) {
    throw new APIError("Missing inputs (images)", 400);
  }

  const multi = [];
  let questionUrl;
  let file, fileUri;

  // Get unique file directory
  let fileDir;
  try {
    fileDir = await getFileDir4AWS(req);
  } catch (e) {
    throw e;
  }

  // Save in CDN
  for (const i in fKeys) {
    file = req.files[fKeys[i]];
    if (file.mimetype === "image/png") {
      fileUri = `${fileDir}${fKeys[i]}.png`;
    } else if (file.mimetype === "image/jpeg") {
      fileUri = `${fileDir}${fKeys[i]}.jpeg`;
    } else {
      throw new APIError("Invalid file type. JPEG and PNG only.", 400);
    }
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileUri,
          Body: file.data,
        })
      );
    } catch (err) {
      throw new APIError("Failed to upload", 500);
    }

    if (fKeys[i] === "question") {
      questionUrl = bucketURL + fileUri;
    } else {
      multi.push({
        image: bucketURL + fileUri,
        trueAnswer: req.body.trueAnswer === fKeys[i],
      });
    }
  }

  let createdQuestion, result;

  try {
    createdQuestion = new Question({
      title: req.body.title,
      description: req.body.description,
      image: questionUrl,
      multi: multi,
      numMulti: multi.length,
      category: req.body.category,
      questionType: req.body.questionType,
      creator: req.name,
      citation: req.body.citation ? req.body.citation : null,
    });
    await createdQuestion.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  try {
    result = await createdQuestion.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }

  return result;
};

const createTQ = async (req) => {
  // Includes question image
  if (!Object.keys(req.files).includes("question") || !req.body.answer) {
    throw new APIError("Missing question (image)", 400);
  }

  // Get unique file directory
  let fileDir;
  try {
    fileDir = await getFileDir4AWS(req);
  } catch (e) {
    throw e;
  }

  const file = req.files["question"];
  let fileUri;
  if (file.mimetype === "image/png") {
    fileUri = `${fileDir}question.png`;
  } else if (file.mimetype === "image/jpeg") {
    fileUri = `${fileDir}question.jpeg`;
  } else {
    throw new APIError("Invalid file type. JPEG and PNG only.", 400);
  }

  //Save in CDN
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileUri,
        Body: file.data,
      })
    );
  } catch (err) {
    throw new APIError("Failed to upload", 500);
  }

  const questionUrl = bucketURL + fileUri;

  let createdQuestion, result;

  try {
    createdQuestion = new Question({
      title: req.body.title,
      description: req.body.description,
      image: questionUrl,
      answer: req.body.answer,
      category: req.body.category,
      questionType: req.body.questionType,
      creator: req.name,
      citation: req.body.citation ? req.body.citation : null,
    });
    await createdQuestion.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  try {
    result = await createdQuestion.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }

  return result;
};

const createDMQ = async (req) => {
  // Includes required fields
  if (
    !req.body.size ||
    !req.body.lives ||
    !req.body.seed ||
    !req.body.gameStartDelay ||
    !req.body.selectionDelay
  ) {
    throw new APIError("Missing fields", 400);
  }

  let createdQuestion;
  try {
    createdQuestion = new Question({
      title: req.body.title,
      description: req.body.description,
      category: "MEMORY",
      questionType: req.body.questionType,
      size: req.body.size,
      lives: req.body.lives,
      seed: req.body.seed,
      creator: req.name,
      citation: "Jack Huang - The University of Auckland (2022)",
      gameStartDelay: req.body.gameStartDelay,
      selectionDelay: req.body.selectionDelay,
    });
    await createdQuestion.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  let result;
  try {
    result = await createdQuestion.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }
  return result;
};

const createDPQ = async (req) => {
  // Includes required fields
  if (
    !req.body.size ||
    !req.body.lives ||
    !req.body.seed ||
    !req.body.randomLevelOrder ||
    !req.body.patternFlashTime ||
    !req.body.corsi ||
    !req.body.reverse
  ) {
    throw new APIError("Missing fields", 400);
  }

  let createdQuestion;
  try {
    createdQuestion = new Question({
      title: req.body.title,
      description: req.body.description,
      category: "MEMORY",
      questionType: req.body.questionType,
      size: req.body.size,
      lives: req.body.lives,
      seed: req.body.seed,
      creator: req.name,
      citation: "Jack Huang - The University of Auckland (2022)",
      patternFlashTime: req.body.patternFlashTime,
      randomLevelOrder: req.body.randomLevelOrder,
      corsi: req.body.corsi,
      reverse: req.body.reverse,
    });
    await createdQuestion.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  let result;
  try {
    result = await createdQuestion.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }
  return result;
};

const updateMCQ = async (req, question) => {
  question.title = req.body.title;
  question.description = req.body.description;
  question.category = req.body.category;
  question.citation = req.body.citation;

  for (let i = 0; i < question.numMulti; i++) {
    question.multi[i].trueAnswer = req.body.multi[i].trueAnswer;
  }

  try {
    await question.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  let result;
  try {
    result = await question.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }

  return result;
};

const updateTQ = async (req, question) => {
  question.title = req.body.title;
  question.description = req.body.description;
  question.category = req.body.category;
  question.citation = req.body.citation;
  question.answer = req.body.answer;

  try {
    await question.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  let result;
  try {
    result = await question.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }

  return result;
};

const updateDMQ = async (req, question) => {
  question.title = req.body.title;
  question.description = req.body.description;
  question.category = req.body.category;
  question.size = req.body.size;
  question.lives = req.body.lives;
  question.seed = req.body.seed;
  question.gameStartDelay = req.body.gameStartDelay;
  question.selectionDelay = req.body.selectionDelay;

  try {
    await question.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  let result;
  try {
    result = await question.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }

  return result;
};

const updateDPQ = async (req, question) => {
  question.title = req.body.title;
  question.description = req.body.description;
  question.category = req.body.category;
  question.size = req.body.size;
  question.lives = req.body.lives;
  question.seed = req.body.seed;
  question.randomLevelOrder = req.body.randomLevelOrder;
  question.patternFlashTime = req.body.patternFlashTime;
  question.corsi = req.body.corsi;
  question.reverse = req.body.reverse;

  try {
    await question.validate();
  } catch (e) {
    throw new APIError("Invalid or missing inputs.", 400);
  }

  let result;
  try {
    result = await question.save();
  } catch (e) {
    throw new APIError("Failed to save in database.", 500);
  }

  return result;
};

////////////////////////
//// MAIN FUNCTIONS ////
////////////////////////

const updateQuestion = async (req, res, next) => {
  let question;
  try {
    question = await Question.findById(req.params.qid).exec();
    if (!question) {
      return next(new APIError("Could not find question", 400));
    }
  } catch (e) {
    return next(new APIError("Could not find question", 400));
  }

  if (question.creator !== req.name) {
    return next(
      new APIError("Cannot edit question, you are not then creator.", 403)
    );
  }

  let result;
  try {
    if (req.body.questionType === "MULTICHOICE") {
      result = await updateMCQ(req, question);
    } else if (req.body.questionType === "TEXT") {
      result = await updateTQ(req, question);
    } else if (req.body.questionType === "DYNAMIC-MEMORY") {
      result = await updateDMQ(req, question);
    } else {
      result = await updateDPQ(req, question);
    }
  } catch (e) {
    return next(e);
  }
  res.status(201).json(result);
};

const createQuestion = async (req, res, next) => {
  // Check if missing any required generic fields
  if (
    !req.body.title ||
    !req.body.description ||
    !["PERCEPTION", "ROTATION", "VISUALISATION", "MEMORY"].includes(
      req.body.category
    ) ||
    !["MULTICHOICE", "TEXT", "DYNAMIC-MEMORY", "DYNAMIC-PATTERN"].includes(
      req.body.questionType
    )
  ) {
    return next(new APIError("Missing fields", 400));
  }

  let result;
  try {
    if (req.body.questionType === "MULTICHOICE") {
      result = await createMCQ(req);
    } else if (req.body.questionType === "TEXT") {
      result = await createTQ(req);
    } else if (req.body.questionType === "DYNAMIC-MEMORY") {
      result = await createDMQ(req);
    } else {
      result = await createDPQ(req);
    }
  } catch (e) {
    return next(e);
  }
  res.status(201).json(result);
};

const deleteQuestionById = async (req, res, next) => {
  let question;
  try {
    question = await Question.findById(req.params.qid).exec();
  } catch (e) {
    return next(new APIError("Could not find question", 400));
  }

  if (question.creator !== req.name) {
    return next(
      new APIError("Cannot edit question, you are not the creator.", 403)
    );
  }

  try {
    await Question.findByIdAndDelete(req.params.qid).exec();
  } catch (e) {
    return next(new APIError("Error deleting question", 404));
  }
  res.json({ message: "Successfully deleted question." });
};

const getAllQuestions = async (req, res, next) => {
  const questions = await Question.find().exec();
  res.json(questions);
};

const getQuestionById = async (req, res, next) => {
  let question;
  try {
    question = await Question.findById(req.params.qid).exec();
  } catch (e) {
    return next(new APIError("Could not find question id.", 404));
  }
  if (!req.permissions.includes("admin")) {
    question = new QuestionOut(question);
  }

  res.json(question);
};

export {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
  updateQuestion,
};
