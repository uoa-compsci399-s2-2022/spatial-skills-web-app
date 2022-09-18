import express from "express";

import { createQuestion,getAllQuestions, getQuestionById, deleteQuestionById } from "../controllers/questions-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";

const questionRouter = express.Router();

//apply JWT handler to all endpoints in this route
questionRouter.use(jwtHandler);

//get all NOTE SHOULD ADD AUTH SO ONLY ADMINS CAN SEE
questionRouter.get("/all",getAllQuestions);

//get question by id
questionRouter.get("/:qid",getQuestionById);

//delete question by id
questionRouter.delete("/:qid",deleteQuestionById);

//add question
questionRouter.post("/",createQuestion);

export default questionRouter;