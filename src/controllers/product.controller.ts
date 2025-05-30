import { Request } from "express"
import { pool } from "../config/db"

export const getAllProducts = async(req:any,res:any) => {
    const {color,limit,page,minPrice,category,id, name, quantity, brand, maxPrice} = req.query
    let query = `SELECT * from products WHERE 1=1`;
    if(color) query = query + ` AND color = "${color}"`
    if(minPrice) query = query + ` AND price>= ${minPrice} `
    if(maxPrice) query = query + ` AND price<= ${maxPrice} `
    if(category) query = query + ` AND category = "${category}"`
    if(id) query = query + ` AND id = ${id}`
    if(name) query = query + ` AND name = "${name}"`
    if(quantity) query = query + ` AND quantity<= ${quantity}`
    if(brand) query = query + ` AND brand ="${brand}"`
    if(limit) query = query + ` LIMIT ${limit}`
    if(page) query = query + ` OFFSET ${(page-1)*limit}`
    const [products] = await pool.query(query)
    return res.status(200).json({msg: "Product fetched successfully", products} )
}

export const getSingleProduct = async(req:any, res:any) =>{
    const {id}= req.params
    const query= `SELECT * from products WHERE id= ${id}`
    const product = await pool.query(query)
    return res.status(200).json({msg: "Product fetched successfully", product} )
}

export const createProduct = async(req:Request, res:any) =>{
    console.log(req.body);
    const { name, price, image, color, quantity, category, brand } = req.body;
    const query = `INSERT INTO PRODUCTS (name, price, image, color, quantity, category, brand) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, price, image, color, quantity, category, brand];
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
    const{color,id} = req.query
    let query = `UPDATE products set color="${color}" WHERE id=${id}`
    const product = await pool.query(query)
    return res.status(200).json({msg: " Product updated successfully", product})
}