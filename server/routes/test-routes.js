import express from "express";

import { createTest, getAllTests } from "../controllers/test-controller.mjs";

const testRouter = express.Router();

testRouter.get("/all", getAllTests);

testRouter.post("/", createTest);

export default testRouter;
