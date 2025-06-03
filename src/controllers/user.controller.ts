import { Request } from "express";
import { pool } from "../config/db";
import Joi, { any } from "joi";
import bcrypt from "bcryptjs";
import { updateProduct } from "./product.controller";

export const getAllUser = async(req:any, res:any)=>{
    const {limit,page} = req.query
    let query = `SELECT * from users WHERE 1=1`;
    if(limit) query = query + ` LIMIT ${limit}`
    if(page) query = query + ` OFFSET ${(page-1)*limit}`;
    const [users] = await pool.query(query)
    return res.status(200).json({msg:"Users:", users})
}

export const getSingleUser = async(req:any, res:any) =>{
    const {id}=req.params
    const query= `SELECT * FROM users where id= ${id}`;
    const [user]= await pool.query(query)
    return res.status(200).json({msg: "User", user})
}

export const createUser = async(req:Request, res:any)=>{
    const { name, address, phone_code, phone_num, email, ROLE, account_password, numVerified, emailVerified, status} = req.body;
    const password = await bcrypt.hash(account_password,10)
    const query = `INSERT INTO users (name, address, phone_code, phone_num, email, ROLE, account_password, numVerified, emailVerified, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, address, phone_code, phone_num, email, ROLE, password, numVerified, emailVerified, status];
    const [result]: any = await pool.query(query, values)
    return res.status(200).json({msg:" User created",id: result.insertId})
}

export const deleteUser = async(req:any, res:any) => {
    const {id}=req.params
    const query = `DELETE FROM users WHERE id= ${id}`;
    const [user] = await pool.query(query)
    return res.status(200).json ({msg:" user deleted", user})
}

export const updateUser = async(req:any, res:any) =>{
    const{id} = req.query;
    const {name, account_password,} = req.body

    const {error} = userDataValidation(req.body)
    if(error) return res.status(400).json({msg:error.details[0].message});
    let updateUser = []
    if(name) updateUser.push(`name= "${name}"`);
    if(account_password){
        const password = await bcrypt.hash(account_password,10)
        updateUser.push(`account_password="${password}"`);
        let query = `UPDATE users set ${updateUser.join(', ')} WHERE id=${id}`;
        const user = await pool.query(query)
        return res.status(200).json({msg: " user updated successfully", user})
    }
}


const userDataValidation = (data:any)=>{
    const schema=Joi.object({
        name:Joi.string(),
        address:Joi.string().required(),
        phone_code:Joi.string(),
        phone_num:Joi.string(),
        email:Joi.string(),
        ROLE:Joi.string(),
        numVerified:Joi.number(),
        account_password:Joi.string(),
        emailVerified:Joi.number()
    }).options({allowUnknown: true})
    return schema.validate(data)
}