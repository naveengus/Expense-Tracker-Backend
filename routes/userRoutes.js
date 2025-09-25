import express from "express";
import userControllers from "../controllers/userControllers.js";
import verify from "../midleware/verify.js";
import multer from "multer";
import path from "path";

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);
router.get("/getUser", verify, userControllers.getUser);
router.put("/updateUser", verify, upload.single("profilePicture"), userControllers.updateUser);

export default router;
