import mongoose from "mongoose";
import QuestionOut from "./question-out.js";
import StudentAnswer from "./student-answer.js";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  questions: [{ type: String, required: false }],
  studentAnswers: [StudentAnswer.schema],
  published: { type: Boolean, required: true },
  code: { type: String, required: true },
  allowBackTraversal: { type: Boolean, required: false, default: false },
  totalTime: { type: Number, required: false, default: null },
  individualTime: { type: Boolean, required: false, default: true },
  shuffleAnswers: { type: Boolean, required: false, default: false },
  shuffleQuestions: { type: Boolean, required: false, default: false },
});

//Check if question already a model before exporting
export default mongoose.models?.Test || mongoose.model("Test", testSchema);
