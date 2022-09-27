import express from "express";
import {
  createStudentAnswer,
  getAllStudentAnswers,
  getStudentAnswerBytIdsId,
} from "../controllers/answer-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";
import adminAuthHandler from "../handlers/admin-auth-handler.js";

const answerRouter = express.Router();

//UNPORTECTED ENDPOINTS

//PROTECTED ENDPOINTS
answerRouter.use(jwtHandler);

//get all (ADMIN)
answerRouter.get("/all", adminAuthHandler, getAllStudentAnswers);

//add student answer
answerRouter.post("/", createStudentAnswer);

//get student answer by test id and student id
answerRouter.post("/getStudentAnswer/", getStudentAnswerBytIdsId);

export default answerRouter;
