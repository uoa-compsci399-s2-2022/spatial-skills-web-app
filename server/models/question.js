import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {type: String, required:true},
    description: {type: String, required:true},
    image: {type: String, required:true},
    answer: [new mongoose.Schema({
        image: {type: String, required:true},
        trueAnswer: {type: Boolean, required:true}
    })],
    category: {type: String, required:true}
});

//Check if question already a model before exporting
export default mongoose.models?.Question || mongoose.model("Question", questionSchema);