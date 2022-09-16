import express from "express";

import { createSignInUser } from "../controllers/user-controller.mjs";

const userRouter = express.Router();

userRouter.post("/", createSignInUser);

export default userRouter;
