import express from "express";
import {
  createStudentAnswer,
  getAllStudentAnswers,
  getStudentAnswerBytIdsId,
} from "../controllers/answer-controller.mjs";

const answerRouter = express.Router();

//get all
answerRouter.get("/all", getAllStudentAnswers);

//add student answer
answerRouter.post("/", createStudentAnswer);

//get student answer by test id and student id
answerRouter.post("/getStudentAnswer/", getStudentAnswerBytIdsId);

export default answerRouter;
