import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  usertype: {
    type: String,
    required: true,
    enum: ["google", "signin"],
  },
  roles: [
    {
      type: String,
      default: "student",
      enum: ["student", "admin"],
    },
  ],
});

//Check if question already a model before exporting
export default mongoose.models?.User || mongoose.model("User", userSchema);
