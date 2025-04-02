const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

mongoose.connect("mongodb+srv://thenularandila2002:Thenula2002@cluster0.tzu8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const reminds = require("./routes/remindRoutes");
const budget = require("./routes/budgetRoutes");
const number = require("./routes/emailRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const check = require('./routes/restockroute')

app.use("/notification", reminds);
app.use("/email", number);
app.use('/api/inventory', inventoryRoutes);
app.use('/checkRestock',check);
app.use("/budget", budget);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
