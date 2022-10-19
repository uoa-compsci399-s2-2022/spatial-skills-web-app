import express from "express";
import {
  createStudentAnswer,
  getAllStudentAnswers,
  getStudentAnswerByCodeName
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

// get student answer by test code and student name
answerRouter.post("/getStudentAnswer/", adminAuthHandler, getStudentAnswerByCodeName);
// answerRouter.post("/getStudentAnswer/", getStudentAnswerByCodeName);


export default answerRouter;
