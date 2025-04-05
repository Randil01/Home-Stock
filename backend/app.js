// Importing necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
 
//db connection
mongoose.connect("mongodb+srv://thenularandila2002:Thenula2002@cluster0.tzu8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("connected to mongodb"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));


// Access to remind
const reminds = require("./routes/remindRoutes");
<<<<<<< Updated upstream
app.use("/notification", reminds);

const number = require("./routes/phoneRoutes");
app.use("/number",number);
=======
const budget = require("./routes/budgetRoutes");
const number = require("./routes/emailRoutes");
const inventoryRoutes = require('./routes/inventoryRoutes');
const assets = require('./routes/assetroutes');

app.use("/notification", reminds);
app.use("/email",number);
app.use('/api/inventory', inventoryRoutes);
app.use("/budget", budget);
app.use("/api/assets",assets);
>>>>>>> Stashed changes
