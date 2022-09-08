import express from "express";
import { createStudentAnswer, getAllStudentAnswers } from "../controllers/answer-controller.mjs";

const answerRouter = express.Router();

//get all
answerRouter.get("/all",getAllStudentAnswers);

//add question
answerRouter.post("/",createStudentAnswer);

export default answerRouter;