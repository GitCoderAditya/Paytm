import { Router } from "express";
import {User, Account} from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import zod from "zod";
import {authMiddleware} from "../middleware.js";
import mongoose from "mongoose";

const router = Router();

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup", async(req, res) => {
    const {success} = signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).send({message: "incorrect inputs"});
    }

    const existingUser = await User.findOne({
        username: req.body.username,
    });

    if(existingUser){
        return res.status(411).send({
            message: "User already exists"
        })
    }

    const {username, password, firstName, lastName} = req.body;

    const newUser = await User.create({
        username,
        password,
        firstName,
        lastName
    });

    const userid = newUser._id;

    await Account.create({
        userid,
        balance: 1 + Math.random() * 10000
    })

   

    res.status(200).send({
        message: "User created successfully",
        userid : newUser._id
    })

})

const signBody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})


router.post("/signin", async(req, res) => {
    
    const {success} = signBody.safeParse(req.body);

    if(!success){
        return res.status(411).send({
            message: "Incorrect inputs"
        })

    }

    const {username, password} = req.body;

    const user = await User.findOne({
        username: username,
        password: password,
    })

    if(user){
        const token = jwt.sign({
            userid: user._id
        }, JWT_SECRET);

        res.status(200).send({
            message: "User signed in successfully",
            token: token
        })

        return;
    }

    res.status(411).send({
        message: "Inavlid credentials"
    })
})

const updateBody = zod.object({
    username : zod.string().email().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
    password : zod.string().optional(),
})

router.put("/update", authMiddleware, async(req, res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).send({
            message: "Incorrect inputs"
        })
    }

    await User.updateOne({_id: req.userid}, req.body);

    res.status(200).send({
        message: "User updated successfully"
    })
})

router.get("/bulk", async(req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
            firstName: {$regex: filter, $options: "i"}
        },{
            lastName: {$regex: filter, $options: "i"}
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})




export default router;
