import {JWT_SECRET} from "./config.js";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).send({message: "Invalid token"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userid = decoded.userid;
        next();
    }
    catch(err){
        res.status(403).json({});
    }


}

export default  {
    authMiddleware
}