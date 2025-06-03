import { Request } from "express"
import { pool } from "../config/db"
import Joi from "joi";

export const getAllBrands = async(req:any,res:any) => {
    //pagination and filter
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

    const {error} = brandDataValidation(req.body) //validation
    if(error) return res.status(400).json({msg: error.details[0].message});

    const [nameExist]:any = await pool.query(`SELECT * from brands where name ="${name}"`);//checking if brand name already exist or not
    if(nameExist.length) return res.status(400).json({msg:"Brand name already exist"});

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
    const {id} = req.query;

    const {is_active, name, description} = req.body

    const {error} = brandDataValidation(req.body)//validation
    if(error) return res.status(400).json({msg: error.details[0].message});

    const [nameExist]:any = await pool.query(`SELECT * from brands where name ="${name}"`);// checking in brand alr exist
    if(nameExist.length) return res.status(400).json({msg:"Brand name already exist"});

    let updatedDataQuery = []

    if(is_active) updatedDataQuery.push(`is_active = ${is_active}`);
    if(name) updatedDataQuery.push(`name = "${name}"`);
    if(description) updatedDataQuery.push(`description = "${description}"`);

    if(updatedDataQuery.length === 0) return res.status(200).json({msg: "No data to update"})

    let query = ` UPDATE brands SET ${updatedDataQuery.join(', ')} WHERE brandid= ${id}`
    const brand = await pool.query(query)
    return res.status(200).json({msg: "Brand updated successfully", brand})
}

//validation
const brandDataValidation = (data:any)=>{
    const schema= Joi.object({
        name:Joi.string(),
        description:Joi.string().required(),
        is_active:Joi.number().integer().max(1).min(0)
    }).options({allowUnknown: true})
    return schema.validate(data)
}