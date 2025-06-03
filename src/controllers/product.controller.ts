import { Request } from "express"
import { pool } from "../config/db"
import Joi from "joi"

export const getAllProducts = async(req:any,res:any) => {
    //pagination and filter 
    const {color,limit,page,minPrice,category,id, name, quantity, brand_id, maxPrice} = req.query
    let query = `SELECT * from products WHERE 1=1`;
    if(color) query = query + ` AND color = "${color}"`
    if(minPrice) query = query + ` AND price>= ${minPrice} `
    if(maxPrice) query = query + ` AND price<= ${maxPrice} `
    if(category) query = query + ` AND category = "${category}"`
    if(id) query = query + ` AND id = ${id}`
    if(name) query = query + ` AND name = "${name}"`
    if(quantity) query = query + ` AND quantity<= ${quantity}`
    if(brand_id) query = query + ` AND brand_id ="${brand_id}"`
    if(limit) query = query + ` LIMIT ${limit}`
    if(page) query = query + ` OFFSET ${(page-1)*limit}`
    const [products] = await pool.query(query)
    return res.status(200).json({msg: "Product fetched successfully", products} )
}

export const getSingleProduct = async(req:any, res:any) =>{
    const {id}= req.params
    const query= `SELECT * from products WHERE id= ${id}`;
    const [product] = await pool.query(query)
    return res.status(200).json({msg: "Product fetched successfully", product} )
}

export const createProduct = async(req:Request, res:any) =>{
    console.log(req.body);
    const { name, price, image, color, quantity, category, brand_id } = req.body;

    const {error} =  productDataValidation(req.body)//validation
    if(error) return res.status(400).json({msg: error.details[0].message})

    const [brandExist]: any = await pool.query(`SELECT * from brands where id = ${brand_id}`)//making sure the product brand alr exists
    if(!brandExist.length) return res.status(400).json({msg:"Brand not exist"})

    const query = `INSERT INTO PRODUCTS (name, price, image, color, quantity, category, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, price, image, color, quantity, category, brand_id];
    const [result]:any  = await pool.query(query, values)
    return res.status(200).json({msg:" product created successfully",id: result.insertId})

};

export const deleteProduct = async(req:any, res:any) =>{
    const {id}= req.params
    const query =`DELETE FROM products WHERE id= ${id}`
    const product = await pool.query(query)
    return res.status(200).json({msg: " Product deleted successfully", product})
}

export const updateProduct = async(req:any, res:any) =>{
    const{id} = req.query;
    const {color, category, price, name, brand_id, quantity} = req.body

    const {error} =  productDataValidation(req.body)
    if(error) return res.status(400).json({msg: error.details[0].message});
    
    const [brandExist]: any = await pool.query(`SELECT * from brands where id = ${brand_id}`);
    if(!brandExist.length) return res.status(400).json({msg:"Brand not exist"});

    let updatedProduct = []
    if(color) updatedProduct.push(`color= "${color}"`);
    if(category) updatedProduct.push(`category= "${category}"`);
    if(price) updatedProduct.push(`price= ${price}`);
    if(name) updatedProduct.push(`name= "${name}"`);
    if(brand_id) updatedProduct.push(`brand_id= "${brand_id}"`);
    if(quantity) updatedProduct.push(`quantity= ${quantity}`);
    if(updatedProduct.length === 0) return res.status(200).json({msg:"No data to update"})
    let query = `UPDATE products set ${updatedProduct.join(', ')} WHERE id=${id}`
    const product = await pool.query(query)
    return res.status(200).json({msg: " Product updated successfully", product})
}

const productDataValidation = (data:any)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        price:Joi.number().required(),
        image:Joi.string().required(),
        color:Joi.string().required(),
        quantity:Joi.number().required(),
        category:Joi.string().required(),
        brand_id:Joi.number().required()
    }).options({allowUnknown: true})
    return schema.validate(data)
} 