import express from "express";

import {
  createTest,
  getTestByCode,
  getMyTests,
  editTest,
  deleteTest
} from "../controllers/test-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";
import adminAuthHandler from "../handlers/admin-auth-handler.js";

const testRouter = express.Router();

//PROTECTED ENDPOINTS
testRouter.use(jwtHandler);

// ADMIN
testRouter.post("/", adminAuthHandler, createTest);

// ADMIN
testRouter.get("/mytests", adminAuthHandler, getMyTests);

// ADMIN or student
testRouter.get("/code/:code", getTestByCode);

// ADMIN
testRouter.patch("/code/:code", adminAuthHandler, editTest);

// ADMIN
testRouter.delete("/code/:code", adminAuthHandler, deleteTest);

export default testRouter;
