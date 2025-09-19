import express from "express"
import userRoutes from "./userRoutes.js"
import incomeRoutes from "./incomeRoutes.js"
import expenseRoutes from "./expenseRoutes.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.send("backend working ")
});

router.use("/api/user", userRoutes);
router.use("/income", incomeRoutes);
router.use("/expense", expenseRoutes);

export default router