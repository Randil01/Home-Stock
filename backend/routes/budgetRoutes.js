const express = require('express');
const Budget = require('../model/budgetModel');

const router = express.Router();

// Add a new bill or expense
router.post('/add', async (req, res) => {
    try {
        const newBudget = new Budget(req.body);
        await newBudget.save();
        res.status(200).json({ success: "Budget entry saved successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all budget entries
router.route("/display").get((req, res) => {
    Budget.find().then((Budget)=>{
        res.json(Budget)
    }).catch((err)=>{
        console.log(err)
    })
});

// Get a specific budget entry
router.get('/:id', async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ error: 'Budget entry not found' });
        res.status(200).json(budget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a budget entry
router.put('/update/:id', async (req, res) => {
    try {
        await Budget.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).json({ success: "Budget updated successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a budget entry
router.delete('/delete/:id', async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        if (!budget) return res.status(404).json({ error: "Entry not found" });
        res.status(200).json({ message: "Budget entry deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Generate a monthly report (group expenses by category)
router.get('/report/monthly', async (req, res) => {
    try {
        const report = await Budget.aggregate([
            { 
                $group: { 
                    _id: "$category", 
                    totalAmount: { $sum: "$amount" }, 
                    count: { $sum: 1 } 
                } 
            }
        ]);
        res.status(200).json({ success: true, report });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
 