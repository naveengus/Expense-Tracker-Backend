import express from "express"
import incomeControllers from "../controllers/incomeControllers"

const router = express.Router;

router.post("/createIncome", incomeControllers.createIncome);
router.get("/getIncomes", incomeControllers.getIncomes);

export default router;