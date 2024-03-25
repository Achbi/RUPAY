const express = require("express");
const router = express.Router();
const {user} = require("../DATABASE/db");
const zod = require("zod");
const{password} = require("./type");
const{username} = require("./type");
const{firstname} = require("./type");
const{lastname} = require("./type");
const{JWT_SECRET} = require("../solution/config");
const{userMiddleware} = require("../middleware/usermiddleware");
const {updatebody} = require("./type");
const {account} = require("../DATABASE/db");
const jwt = require("jsonwebtoken")

const mongoose = require('mongoose'); 


router.get("/balance", userMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ balance: account.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transfer", userMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

    if (!fromAccount || fromAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Recipient account not found" });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
});

module.exports = router;
