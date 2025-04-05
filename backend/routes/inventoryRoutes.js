const express = require('express');
const router = express.Router();
const Inventory = require('../model/Inventory');

router.post('/add', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/report', async (req, res) => {
  try {
    const items = await Inventory.find({}, 'productName purchaseDate productCategory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bill', async (req, res) => {
  try {
    const items = await Inventory.find();
    const bill = items.map(item => ({
      productName: item.productName,
      purchaseDate: item.purchaseDate.toLocaleDateString(),
      purchaseQuantity: item.purchaseQuantity,
      productCategory: item.productCategory
    }));
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;