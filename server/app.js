import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // https://www.npmjs.com/package/cors

import connectDB from "./db/db.js";
import authRouter from "./routes/auth-routes.js";
import questionRouter from "./routes/question-routes.js";
import testRouter from "./routes/test-routes.js";
import answerRouter from "./routes/answer-routes.js";
import userRouter from "./routes/user-routes.js";
import errorHandler from "./handlers/error-handler.js";

const app = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allows fetch api to access localhost endpoints
//parse json requests
app.use(express.json());
//parse cookies
app.use(cookieParser());

//authentication APIs
app.use("/api/auth", authRouter);

//question APIs
app.use("/api/question", questionRouter);

//test APIs
app.use("/api/test", testRouter);

//answer APIs
app.use("/api/answer", answerRouter);

//user APIs
app.use("/api/user", userRouter);

app.get("/", (req, res) => res.send("Hello world!"));

//error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
