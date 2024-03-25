const mongoose = require('mongoose');
const Account = require('./path-to-your-account-model');

const transferFunds = async (fromAccountId, toAccountId, amount) => {
// Decrement the balance of the fromAccount
await Account.findByIdAndUpdate(fromAccountId, { $inc: { balance: -amount } });

// Increment the balance of the toAccount
await Account.findByIdAndUpdate(toAccountId, { $inc: { balance: amount } });
}
// Example usage
transferFunds('fromAccountID', 'toAccountID', 100);










router.post("/transfer", userMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const { amount, to } = req.body;
    
    // Fetch the accounts within the transaction
    const account = await account.findOne({ userId: req.userId }).session(session);
    
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    
    const toAccount = await account.findOne({ userId: to }).session(session);
    
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    
    // Perform the transfer
    await account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    
    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});


















router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const { amount, to } = req.body;
    
    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);
    
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    
    const toAccount = await Account.findOne({ userId: to }).session(session);
    
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    
    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    
    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});
