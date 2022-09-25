import express from "express";

import { createStudent } from "../controllers/user-controller.mjs";
import jwtHandler from "../handlers/jwt-handler.js";

const userRouter = express.Router();

//apply JWT handler to all endpoints in this route
// userRouter.use(jwtHandler);

userRouter.post("/createStudent", createStudent);

export default userRouter;
