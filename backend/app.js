// Importing necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
 
//db connection
mongoose.connect("mongodb+srv://thenularandila2002:Thenula2002@cluster0.tzu8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("connected to mongodb"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));


// Access to remind
const reminds = require("./routes/remindRoutes");
app.use("/notification", reminds);