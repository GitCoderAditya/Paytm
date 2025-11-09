import { Router } from "express";
import {User} from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import zod from "zod";

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

    const userid = username._id;

    const token = jwt.sign({
        userid
    }, JWT_SECRET);

    res.status(200).send({
        message: "User created successfully",
        token: token
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



export default router;
