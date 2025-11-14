import express from "express";
import { Account } from "../db.js";
import  authMiddleware  from "../middleware.js";
const router = express.Router();


router.get("/balance",authMiddleware, async(req, res) => {
    const account = await Account.findOne({
        userid: req.userid
    })

    res.status(200).send({
        balance: account.balance
    })

})

router.post("/transfer", authMiddleware, async(req, res) => {
    try {
        const {touserid, amount} = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).send({
                message: "Invalid amount"
            });
        }

        // Check sender account
        const account = await Account.findOne({userid: req.userid});

        if(!account || account.balance < amount){
            return res.status(400).send({
                message: "Insufficient balance"
            });
        }

        // Check receiver account
        const toAccount = await Account.findOne({userid: touserid});

        if(!toAccount){
            return res.status(400).send({
                message: "Recipient account not found"
            })
        }

        // Perform transfer (without transaction for single MongoDB instance)
        await Account.updateOne({userid: req.userid}, {
            $inc: {balance: -amount}
        });
        await Account.updateOne({userid: touserid}, {
            $inc: {balance: +amount}
        });

        res.json({
            message: "Transfer successful"
        })
    } catch (error) {
        res.status(500).send({
            message: "Error processing transfer",
            error: error.message
        });
    }
})

export default router;