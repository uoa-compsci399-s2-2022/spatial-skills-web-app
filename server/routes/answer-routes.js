import express from "express";
import {
  createStudentAnswer,
  getAllStudentAnswers,
  getStudentAnswerBytIdsId,
} from "../controllers/answer-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";

const answerRouter = express.Router();

//apply JWT handler to all endpoints in this route
answerRouter.use(jwtHandler);

//get all
answerRouter.get("/all", getAllStudentAnswers);

//add student answer
answerRouter.post("/", createStudentAnswer);

//get student answer by test id and student id
answerRouter.post("/getStudentAnswer/", getStudentAnswerBytIdsId);

export default answerRouter;
