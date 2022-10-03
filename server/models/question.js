import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  answer: [
    new mongoose.Schema({
      image: { type: String, required: false },
      trueAnswer: { type: Boolean, required: false },
    }),
  ],
  category: {
    type: String,
    enum: ["PERCEPTION", "ROTATION", "VISUALISATION", "MEMORY"],
    required: true,
  },
  questionType: {
    type: String,
    enum: ["MULTICHOICE", "TEXT", "DYNAMIC"],
    required: true,
  },
  citation: {
    type: String,
    required: false,
  },
});

//Check if question already a model before exporting
export default mongoose.models?.Question ||
  mongoose.model("Question", questionSchema);
