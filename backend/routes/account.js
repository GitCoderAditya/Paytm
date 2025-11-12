import express from "express";
import { Account } from "../db.js";
import  authMiddleware  from "../middleware.js";
const router = express.Router();
import mongoose from "mongoose";


router.get("/balance",authMiddleware, async(req, res) => {
    const account = await Account.findOne({
        userid: req.userid
    })

    res.status(200).send({
        balance: account.balance
    })

})

router.post("/transfer", authMiddleware, async(req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    const {touserid, amount} = req.body;

    const account = await Account.findOne({userid: req.userid}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).send({
            message: " insufficient balance"
        });
    }

    const toAccount = await Account.findOne({userid: touserid}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).send({
            message: " to account not found"
        })
    }

    await Account.updateOne({userid: req.userid}, {
        $inc: {balance: -amount}
    }).session(session);
    await Account.updateOne({userid: touserid}, {
        $inc: {balance: +amount}
    }).session(session);

    await session.commitTransaction();
    res.json({
        message: " Transfer successfull"
    })
})

export default router;