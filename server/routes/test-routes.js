import express from "express";

import {
  createTest,
  getAllTests,
  getTestById,
  getQuestionsBytId,
} from "../controllers/test-controller.mjs";

const testRouter = express.Router();

testRouter.get("/all", getAllTests);

testRouter.get("/getquestions", getQuestionsBytId);

testRouter.get("/:tid", getTestById);

testRouter.post("/", createTest);

export default testRouter;
