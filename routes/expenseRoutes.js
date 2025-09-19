import express from "express"
import expenseControllers from "../controllers/expenseControllers.js"
import verify from "../midleware/verify.js";

const router = express.Router();

router.post("/createExpense", verify, expenseControllers.createExpense);
router.get("/getExpense", verify, expenseControllers.getExpense);

export default router;