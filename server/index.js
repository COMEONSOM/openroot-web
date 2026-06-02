// ============================================================
// OPENROOT WEB CLASSES — PRODUCTION SERVER (RENDER READY)
// RAZORPAY PAYMENT BACKEND
// ============================================================

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // ✅ LOAD ENV VARIABLES

const app = express();

// ============================================================
// MIDDLEWARES
// ============================================================

app.use(cors());
app.use(bodyParser.json());

// ============================================================
// HEALTH CHECK (RENDER NEEDS THIS)
// ============================================================

app.get("/", (req, res) => {
  res.status(200).send("✅ Openroot Web Backend is Running");
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ============================================================
// RAZORPAY INSTANCE
// ============================================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================
// CREATE ORDER API
// ============================================================

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ VALIDATION
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100, // INR ➜ PAISE
      currency: "INR",
      receipt: "openroot_" + Date.now(),
    });

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ CREATE ORDER ERROR:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ============================================================
// PAYMENT VERIFICATION API
// ============================================================

app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ status: "failed", reason: "Missing fields" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    console.error("❌ VERIFY ERROR:", err);
    res.status(500).json({ status: "error" });
  }
});

// ============================================================
// START SERVER (RENDER + MOBILE READY ✅)
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT}`);
});