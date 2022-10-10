import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema({
  tId: { type: String, required: true },
  sId: { type: String, required: true },
  answers: [
    new mongoose.Schema({
      qId: { type: String, required: true },
      aId: { type: String, required: false, default: null },
      value: { type: String, required: false, default: null  },
      correct: { type: Boolean, required: false, default: null },
    }),
  ],
  grade: {type: Number, required: false, default: null}
});

export default mongoose.models?.StudentAnswer ||
  mongoose.model("StudentAnswer", studentAnswerSchema);
