import Expense from "../models/expenseCreate.js"

const createExpense = async (req, res) => {
    try {
        const { amount, date, category, notes } = req.body;
        const expense = new Expense({
            amount,
            date,
            category,
            notes,
            userId: req.user.id,
        })
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error creating Expense", error: error.message });
    }
}

const getExpense = async (req, res) => {
    try {
        const expense = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error fetching expense", error: error.message });
    }
}

export default {
    createExpense,
    getExpense,
}