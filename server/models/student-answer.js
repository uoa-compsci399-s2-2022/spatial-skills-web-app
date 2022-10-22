import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema({
  testCode: { type: String, required: true },
  studentName: { type: String, required: true },
  answers: [
    new mongoose.Schema({
      qId: { type: String, required: true },
      questionType: {type: String, required: true },
      aIds: [{ type: String, required: false, default: null }],
      textAnswer: { type: String, required: false, default: null },
      value: { type: mongoose.Decimal128, required: false, default: null },
      grade: { type: mongoose.Decimal128, required: false, default: null },
      percentage: {type: mongoose.Decimal128, required: false, default: null},
      possibleGrade: { type: mongoose.Decimal128, required: false, default: null },
      questionTitle: { type: String, required: false, default: null }
    }),
  ],
  totalGrade: {type: mongoose.Decimal128, required: false, default: null},
  totalPercentage: {type: mongoose.Decimal128, required: false, default: null},
  totalPossibleGrade: {type: mongoose.Decimal128, required: false, default: null},
  totalTimeTaken: {type: mongoose.Decimal128, required: false, default: null}
});

export default mongoose.models?.StudentAnswer ||
  mongoose.model("StudentAnswer", studentAnswerSchema);
