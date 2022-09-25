import express from "express";

import {
  createTest,
  getAllTests,
  getTestById,
  getQuestionsBytId,
} from "../controllers/test-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";

const testRouter = express.Router();

//UNPORTECTED ENDPOINTS

//PROTECTED ENDPOINTS
testRouter.use(jwtHandler);

testRouter.post("/", createTest);

testRouter.get("/all", getAllTests);

testRouter.post("/getquestions", getQuestionsBytId);

testRouter.get("/:tid", getTestById);

export default testRouter;
