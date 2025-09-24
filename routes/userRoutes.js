import express from "express";
import userControllers from "../controllers/userControllers.js";
import verify from "../midleware/verify.js";
const router = express.Router();

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login)
router.get("/getUser", verify, userControllers.getUser)
router.put("/updateUser", verify, userControllers.updateUser)
export default router;
