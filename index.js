import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv"
import Routes from "./routes/index.js"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(Routes)

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("mongoDb connected"))
    .catch((err) => console.log(err))

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server running on the port ${PORT}`))