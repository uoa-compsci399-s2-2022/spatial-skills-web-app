// import mongoose from 'mongoose';

import Question from "../models/question.js";
import QuestionOut from "../models/question-out.js";
import Test from "../models/test.js";
import APIError from "../handlers/APIError.js";

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

export { createQuestion, getAllQuestions, getQuestionById, deleteQuestionById };
