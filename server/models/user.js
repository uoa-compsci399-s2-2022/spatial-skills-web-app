import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: [
    {
      type: String,
    },
  ]
});

//Check if question already a model before exporting
export default mongoose.models?.User || mongoose.model("User", userSchema);
