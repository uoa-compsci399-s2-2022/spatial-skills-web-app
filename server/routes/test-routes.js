import express from "express";

import {
  createTest,
  getAllTests,
  getTestById,
  getQuestionsBytId,
} from "../controllers/test-controller.mjs";

const testRouter = express.Router();

testRouter.post("/", createTest);

testRouter.get("/all", getAllTests);

testRouter.post("/getquestions", getQuestionsBytId);

testRouter.get("/:tid", getTestById);

export default testRouter;
