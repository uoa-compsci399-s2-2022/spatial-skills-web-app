import mongoose from "mongoose";
import QuestionOut from "./question-out.js";
import StudentAnswer from "./student-answer.js";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  questions: [
    new mongoose.Schema({
      question: { type: QuestionOut, required: true },
      time: { type: Number, required: true },
    }),
  ],
  studentAnswers: [StudentAnswer],
  published: { type: Boolean, required: true },
  code: { type: String, required: true },
});

//Check if question already a model before exporting
export default mongoose.models?.Test || mongoose.model("Test", testSchema);
