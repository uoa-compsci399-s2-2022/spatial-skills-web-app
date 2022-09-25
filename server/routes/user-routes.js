import express from "express";

import { createStudent } from "../controllers/user-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";
import loginLimiter from "../handlers/login-limiter.js";

const userRouter = express.Router();

//UNPORTECTED ENDPOINTS

userRouter.post("/createStudent", loginLimiter, createStudent);

//PROTECTED ENDPOINTS
userRouter.use(jwtHandler);

export default userRouter;
