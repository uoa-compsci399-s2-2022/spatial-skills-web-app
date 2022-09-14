import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema({
  tId: { type: String, required: true },
  sId: { type: String, required: true },
  answers: [
    new mongoose.Schema({
      qId: { type: String, required: true },
      aId: { type: String, required: true },
      correct: { type: Boolean, required: true },
    }),
  ],
  grade: {type: Number, required: true}
});

export default mongoose.models?.StudentAnswer ||
  mongoose.model("StudentAnswer", studentAnswerSchema);
