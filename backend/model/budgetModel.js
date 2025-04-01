const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true  // Expense category (e.g., Rent, Utilities, Groceries)
    },
    amount: {
        type: Number,
        required: true  // Expense amount
    },
    dueDate: {
        type: Date,  // Due date for bills (e.g., rent, electricity)
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],  // Bill status
        default: 'Pending'
    },
    description: {
        type: String  // Additional details
    }
});

module.exports = mongoose.model('Budget', budgetSchema);
