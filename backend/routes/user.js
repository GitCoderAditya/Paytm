import { Router } from "express";
import {User} from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import zod from "zod";

const router = Router();

router.post("/signup", async(req, res) => {
    
})



export default router;
