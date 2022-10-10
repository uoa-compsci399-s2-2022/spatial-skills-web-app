import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  // GENERIC QUESTION FIELDS
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false, default: null },
  category: {
    type: String,
    enum: ["PERCEPTION", "ROTATION", "VISUALISATION", "MEMORY"],
    required: true,
  },
  questionType: {
    type: String,
    enum: [
      "MULTICHOICE-MULTI",
      "MULTICHOICE-SINGLE",
      "TEXT",
      "DYNAMIC-MEMORY",
      "DYNAMIC-PATTERN",
    ],
    required: true,
  },
  creator: { type: String, required: true },
  citation: { type: String, required: false, default: null },
  testCode: { type: String, required: true },
  time: { type: mongoose.Decimal128, required: false},

  //REQUIREMENTS FOR DIFFERENT QUESTION TYPES WILL BE VALIDATED IN MIDDLEWARE
  // questionType MULTICHOICE fields
  multi: [
    new mongoose.Schema({
      image: { type: String, required: false },
      grade: { type: mongoose.Decimal128, required: false },
    }),
  ],
  numMulti: { type: Number, required: false, default: null },
  totalMultiGrade: {type: mongoose.Decimal128, required: false, default: null},

  // questionType TEXT
  answer: { type: String, required: false, default: null },
  textGrade: { type: mongoose.Decimal128, required: false, default: null },

  // questionType DYNAMIC-MEMORY and DYNAMIC-PATTERN
  size: { type: Number, required: false, default: null },
  lives: { type: Number, required: false, default: null },
  seed: { type: Number, required: false, default: null },

  // questionType DYNAMIC-PATTERN
  patternFlashTime: {
    type: mongoose.Decimal128,
    required: false,
    default: null,
  },
  randomLevelOrder: { type: Boolean, required: false, default: null },
  corsi: { type: Boolean, required: false, default: null },
  reverse: { type: Boolean, required: false, default: null },

  // questionType DYNAMIC-MEMORY
  gameStartDelay: { type: mongoose.Decimal128, required: false, default: null },
  selectionDelay: { type: mongoose.Decimal128, required: false, default: null },
});

export default mongoose.models?.Question ||
  mongoose.model("Question", questionSchema);
