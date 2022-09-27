import express from "express";

import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestionById,
} from "../controllers/questions-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";
import adminAuthHandler from "../handlers/admin-auth-handler.js";

const questionRouter = express.Router();

//UNPORTECTED ENDPOINTS

//PROTECTED ENDPOINTS
questionRouter.use(jwtHandler);

//get all (ADMIN)
questionRouter.get("/all", adminAuthHandler, getAllQuestions);

//get question by id
questionRouter.get("/:qid", getQuestionById);

//delete question by id (ADMIN)
questionRouter.delete("/:qid", adminAuthHandler, deleteQuestionById);

//add question
questionRouter.post("/", adminAuthHandler, createQuestion);

export default questionRouter;
