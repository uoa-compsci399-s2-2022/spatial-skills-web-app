import express from "express";

import { studentLogin, adminLogin, refresh, logout } from "../controllers/auth-controller.mjs";
import loginLimiter from "../handlers/login-limiter.js";

const authRouter = express.Router();

authRouter.post("/studentLogin", loginLimiter, studentLogin);

authRouter.post("/adminLogin", loginLimiter, adminLogin);

authRouter.get("/refresh", refresh);

authRouter.post("/logout", logout);

export default authRouter;
