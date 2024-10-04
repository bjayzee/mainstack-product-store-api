import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import router from './routes'
connectDB();



const app = express();
app.use(cors({
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', router());


app.get('/', (req: express.Request, res: express.Response) => res.send("Welcome to home page"));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`app listening on port ${PORT}`))