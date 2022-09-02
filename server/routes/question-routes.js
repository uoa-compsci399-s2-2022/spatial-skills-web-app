import express from "express";

import { createQuestion,getQuestions, getQuestionById, deleteQuestionById } from "../controllers/questions-controller.mjs";
const questionRouter = express.Router();

//get question by id
questionRouter.get("/:qid",getQuestionById);

//delete question by id
questionRouter.delete("/:qid",deleteQuestionById);

//add question
questionRouter.post("/",createQuestion);

//get all NOTE SHOULD ADD AUTH SO ONLY ADMINS CAN SEE
questionRouter.get("/",getQuestions);

export default questionRouter;