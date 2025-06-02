import { Request } from "express"
import { pool } from "../config/db"

export const getAllBrands = async(req:any,res:any) => {
    const {name,id,is_active,limit,page} = req.query
    let query = `SELECT * from brands WHERE 1=1`;
    if(name) query = query + ` AND name = "${name}"`
    if(id) query = query + ` AND brandid = ${id}`
    if(is_active) query = query + ` AND is_active=${is_active}`
    if(limit) query = query + ` LIMIT ${limit}`
    if(page) query = query + ` OFFSET ${(page-1)*limit}`
    const [brands] = await pool.query(query)
    return res.status(200).json({msg: "Brand fetched successfully", brands} )

};

export const getSingleBrand = async(req:any,res:any) =>{
    const {id}= req.params
    const query= ` SELECT * FROM brands WHERE brandid= ${id}`
    const [brand]= await pool.query(query)
    return res.status(200).json({msg: "Brand fetched successfully", brand})
};
export const createBrand = async(req:Request, res:any) =>{
    const { name, description, is_active } = req.body;
    const query = ` INSERT INTO brands( name, description, is_active) VALUES (?, ?, ?)`;
    const values = [ name, description, is_active];
    const [result]:any = await pool.query(query,values)
    return res.status(200).json({msg:" brand created successfully",brandid: result.insertId})
};
export const deleteBrand = async(req:any, res:any)=>{
    const {id}= req.params
    const query = ` DELETE FROM brands WHERE brandid= ${id}`
    const brand = await pool.query(query)
    return res.status(200).json({msg: " brand deleted successfully", brand})

}
export const updateBrand = async(req:any, res:any) =>{
    const{is_active,id} = req.query
    let query = ` UPDATE brands set is_active=${is_active} WHERE brandid=${id}`
    const brand = await pool.query(query)
    return res.status(200).json({msg: "Brand updated successfully", brand})
}