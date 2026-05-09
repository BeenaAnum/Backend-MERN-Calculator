const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Schema
const calcSchema = new mongoose.Schema({
  expression: String,
  result: Number
});

const Calc = mongoose.model("Calc", calcSchema);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 MERN Calculator Backend is Running Successfully");
});

// Calculate Route
app.post("/calculate", async (req, res) => {

  const { expression } = req.body;

  try {

    const result = eval(expression);

    // Save to MongoDB
    const data = new Calc({
      expression,
      result
    });

    await data.save();

    res.json({ result });

  } catch (err) {

    res.status(400).json({
      error: "Invalid Expression"
    });

  }

});

// History Route
app.get("/history", async (req, res) => {

  try {

    const data = await Calc.find();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch history"
    });

  }

});

// Local Server
if (process.env.NODE_ENV !== "production") {

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });

}

// Export for Vercel
module.exports = app;
