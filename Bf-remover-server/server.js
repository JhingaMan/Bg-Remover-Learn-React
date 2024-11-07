import "dotenv/config";
import express from "express";
import cors from "cors";
import connectdb from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";

const PORT = process.env.PORT || 4000;

const app = express();

//Initialize MiddleWare

app.use(express.json());
app.use(cors());
await connectdb()
// API routes

app.get("/", (req, res) => res.send("API Working"));

app.use('/api/user', userRouter)

app.listen(PORT, () => console.log(`server running on ${PORT}`));
