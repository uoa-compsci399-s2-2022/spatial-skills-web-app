import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_CONNECTION_STRING = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@clusterspatialskillstes.yaxohc5.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {

    try {
        await mongoose.connect(
            MONGODB_CONNECTION_STRING,
            {
                useNewUrlParser: true
            }
        )
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

export default connectDB;