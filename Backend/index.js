import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDb from "./db/connectDb.js";
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
connectDb();

app.use(express.json({limit: "5mb"}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));


app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);



