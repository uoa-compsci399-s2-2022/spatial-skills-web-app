import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // https://www.npmjs.com/package/cors
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

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

if (process.env.PRODUCTION === "prod") {
  app.use(cors({ origin: "https://hydrohomiebeerbro.com", credentials: true })); // Allows fetch api to access localhost 
} else {
  app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allows fetch api to access localhost endpoints
}


//parse json requests
app.use(express.json());
//parse cookies
app.use(cookieParser());
app.use(fileUpload());

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


// https://bobbyhadz.com/blog/javascript-dirname-is-not-defined-in-es-module-scope#:~:text=To%20solve%20the%20%22__dirname%20is,directory%20name%20of%20the%20path.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build from backend if in production
if (process.env.PRODUCTION === "prod") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Hello world!"));
}

//error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
