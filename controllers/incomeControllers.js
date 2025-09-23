import Income from "../models/incomeCreate.js"

const createIncome = async (req, res) => {
    try {
        const { amount, date, category, notes } = req.body;
        const income = new Income({
            amount,
            date,
            category,
            notes,
            userId: req.user.id, // JWT la irunthu user id
        });
        await income.save();
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: "Error creating income", error: error.message });
    }
}

const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching incomes", error: error.message });
    }
};


export default {
    createIncome,
    getIncomes,
}