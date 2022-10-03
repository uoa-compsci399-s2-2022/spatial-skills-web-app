import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

import Question from "../models/question.js";
import QuestionOut from "../models/question-out.js";
import Test from "../models/test.js";
import APIError from "../handlers/APIError.js";
import { s3Client } from "../db/aws.js";

const REGION = "ap-southeast-2";
const bucketURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;

const createMultiChoiceQuestion = async (req, res, next) => {
  const fKeys = Object.keys(req.files);

  // Atleast two answers and question
  if (fKeys.length < 3 || !fKeys.includes("question")) {
    return next(new APIError("Missing inputs (images)", 400));
  }

  // Check if missing any text inputs
  if (
    !req.body.title ||
    !req.body.category ||
    !req.body.description ||
    !req.body.trueAnswer
  ) {
    return next(new APIError("Missing inputs (text)", 400));
  }

  // Check if any invalid inputs
  if (
    !fKeys.includes(req.body.trueAnswer) ||
    !["PERCEPTION", "ROTATION", "VISUALISATION", "MEMORY"].includes(
      req.body.category
    ) ||
    req.body.questionType !== "MULTICHOICE"
  ) {
    return next(new APIError("Invalid inputs", 400));
  }

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
        return next(new APIError());
      }
    }
  }

  fileDir = `${fileDir}-${uuid}/`;

  const answerArr = [];
  let questionUrl;
  let file, fileUri;

  // Save in CDN
  for (const i in fKeys) {
    file = req.files[fKeys[i]];
    if (file.mimetype === "image/png") {
      fileUri = `${fileDir}${fKeys[i]}.png`;
    } else if (file.mimetype === "image/jpeg") {
      fileUri = `${fileDir}${fKeys[i]}.jpeg`;
    } else {
      return next(new APIError("Invalid file type. JPEG and PNG only.", 400));
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
      return next(new APIError("Failed to upload", 500));
    }

    if (fKeys[i] === "question") {
      questionUrl = bucketURL + fileUri;
    } else {
      answerArr.push({
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
      answer: answerArr,
      category: req.body.category,
      questionType: req.body.questionType,
      citation: req.body.citation ? req.body.citation : null,
    });
    await createdQuestion.validate();
  } catch (e) {
    return next(new APIError("Invalid or missing inputs.", 400));
  }

  try {
    result = await createdQuestion.save();
  } catch (e) {
    return next(new APIError("Failed to save in database.", 500));
  }

  res.status(201).json(result);
};

// DEPRECATE (replace with createMultiChoiceQuestion and createTextQuestion)
const createQuestion = async (req, res, next) => {
  let createdQuestion, result;

  try {
    createdQuestion = new Question({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      answer: req.body.answer,
      category: req.body.category,
    });
    await createdQuestion.validate();
  } catch (e) {
    return next(new APIError("Invalid or missing inputs.", 400));
  }

  try {
    result = await createdQuestion.save();
  } catch (e) {
    return next(new APIError("Failed to save in database.", 500));
  }
  res.status(201).json(result);
};

const deleteQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.qid).exec();
  } catch (e) {
    return next(new APIError("Could not find question id.", 404));
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
  const questionOut = new QuestionOut(question);
  res.json(questionOut);
};

export {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
  createMultiChoiceQuestion,
};
