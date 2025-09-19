import express from "express"
import incomeControllers from "../controllers/incomeControllers.js"
import verify from "../midleware/verify.js";
const router = express.Router();

router.post("/createIncome", verify, incomeControllers.createIncome);
router.get("/getIncomes", verify, incomeControllers.getIncomes);

export default router;