
import express from 'express';
import connectDB from './db/db.js';

const app = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

app.get('/', (req, res) => res.send("Hello world!"));

app.listen(port, () => console.log(`Server running on port ${port}`));
