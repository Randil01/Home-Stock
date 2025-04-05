const express = require("express");
const Asset = require("../model/assetModel");

const router = express.Router();

// ➕ Add a new asset
router.post("/add", async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    await newAsset.save();
    res.status(201).json({ success: "Asset added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get all assets
router.get("/display", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔍 Get a specific asset by ID
router.get("/:id", async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.status(200).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ Update an asset
router.put("/update/:id", async (req, res) => {
  try {
    await Asset.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json({ success: "Asset updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete an asset
router.delete("/delete/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Generate PDF report
router.get("/report/pdf", async (req, res) => {
  try {
    const assets = await Asset.find();

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=asset_report.pdf");

    doc.pipe(res); // Stream PDF directly to the response

    doc.fontSize(18).text("Asset Management Report", { align: "center" });
    doc.moveDown(1);

    // Table header
    doc.fontSize(12).text("Name", 50, doc.y, { continued: true });
    doc.text("Category", 180, doc.y, { continued: true });
    doc.text("Value (LKR)", 320, doc.y, { continued: true });
    doc.text("Purchase Date", 430, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table body
    assets.forEach((asset) => {
      doc.text(asset.name, 50, doc.y, { continued: true });
      doc.text(asset.category, 180, doc.y, { continued: true });
      doc.text(`LKR ${asset.value}`, 320, doc.y, { continued: true });
      doc.text(new Date(asset.purchase_date).toLocaleDateString(), 430, doc.y);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
});

module.exports = router;
