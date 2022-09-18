import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: false,
  },
  permissions: [
    {
      type: String,
    },
  ],
});

//Check if question already a model before exporting
export default mongoose.models?.User || mongoose.model("User", userSchema);
