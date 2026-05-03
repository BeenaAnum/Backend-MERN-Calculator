const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Schema
const calcSchema = new mongoose.Schema({
  expression: String,
  result: Number
});

const Calc = mongoose.model("Calc", calcSchema);

// API route
app.post("/calculate", async (req, res) => {
  const { expression } = req.body;

  try {
    const result = eval(expression); // simple for beginner

    const data = new Calc({ expression, result });
    await data.save();

    res.json({ result });
  } catch (err) {
    res.json({ error: "Invalid Expression" });
  }
});

app.get("/history", async (req, res) => {
  const data = await Calc.find();
  res.json(data);
});

app.listen(5000, () => console.log("History Server running on 5000"));