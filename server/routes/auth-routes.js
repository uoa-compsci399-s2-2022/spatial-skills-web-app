import express from "express";

import { login, refresh, logout } from "../controllers/auth-controller.mjs";
import loginLimiter from "../handlers/login-limiter.js";

const authRouter = express.Router();

authRouter.post("/", loginLimiter, login);

authRouter.get("/refresh", refresh);

authRouter.post("/logout", logout);

export default authRouter;
