
import express from 'express';

import connectDB from './db/db.js';
import questionRouter from './routes/question-routes.js';


const app = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

//parse json requests
app.use(express.json());

//question api's
app.use('/api/question',questionRouter);

app.get('/', (req, res) => res.send("Hello world!"));

app.listen(port, () => console.log(`Server running on port ${port}`));
