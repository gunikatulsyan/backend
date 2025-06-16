
import { pool } from "../config/db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import "dotenv/config"


const PRIVATE_KEY = process.env.SECRET_KEY || "ecommerce"


export const login = async(req:any,res:any) => {
    const { email, password } = req.body;
    const [user]: any = await pool.query(`SELECT * from users where email="${email}"`);
    if(!user.length) return res.status(400).json({msg:"email doesnot exist"});
    console.log("user", user)
    const isMatch = await bcrypt.compare(password, user[0].account_password)
    if(!isMatch) return res.status(401).json({ error: `Invalid credentials`});
    const token =  jwt.sign({user: user[0]}, PRIVATE_KEY, {expiresIn: "1hr"})
    return res.status(200).json({msg: "login sucessfully", token, user: user[0]} )
};

