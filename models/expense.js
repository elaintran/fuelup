const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    station: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;