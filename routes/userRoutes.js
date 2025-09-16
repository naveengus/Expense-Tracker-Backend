import express from "express";
import userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", userControllers.signup);

export default router;
