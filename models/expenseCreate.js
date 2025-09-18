import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
