import express from "express";
import userControllers from "../controllers/userControllers.js";
import verify from "../midleware/verify.js";
import upload from "../common/cloudinary.js"; // only cloudinary upload

const router = express.Router();

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.get("/getUser", verify, userControllers.getUser);
router.post("/forgotPassword", userControllers.forgotPassword)
router.post("/resetPassword", userControllers.resetPassword)
router.put("/updateUser", verify, upload.single("profilePicture"), userControllers.updateUser);

export default router;
