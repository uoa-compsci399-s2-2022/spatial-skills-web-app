// import mongoose from 'mongoose';

import Question from '../models/question.js';
import QuestionOut from '../models/question-out.js';

const createQuestion = async (req, res, next) => {
    const createdQuestion = new Question({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        answer: req.body.answer
    });

    const result = await createdQuestion.save();
    res.status(201).json(result);
};

const deleteQuestionById = async(req,res,next) => {
    const question = await Question.findByIdAndDelete(req.params.qid).exec();
    res.json({message: "Successfully deleted question."});
};

const getQuestions = async(req,res,next) => {
    const questions = await Question.find().exec();
    res.json(questions);
};

const getQuestionById = async(req,res,next) => {
    const question = await Question.findById(req.params.qid).exec();
    const questionOut = new QuestionOut(question)
    res.json(questionOut);
};

export {createQuestion,getQuestions,getQuestionById,deleteQuestionById};