import express from "express";

import {
  createTest,
  getAllTests,
  getTestById,
  getQuestionsBytId,
  getQuestionsByCode,
  getTestByCode
} from "../controllers/test-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";
import adminAuthHandler from "../handlers/admin-auth-handler.js";

const testRouter = express.Router();

//UNPORTECTED ENDPOINTS

//PROTECTED ENDPOINTS
testRouter.use(jwtHandler);

// ADMIN
testRouter.post("/", adminAuthHandler, createTest);

// ADMIN
testRouter.get("/all", adminAuthHandler, getAllTests);

testRouter.post("/getquestions", getQuestionsBytId);

testRouter.get("/:tid", getTestById);

testRouter.post("/code/getquestions", getQuestionsByCode);

testRouter.get("/code/:code", getTestByCode);

export default testRouter;
