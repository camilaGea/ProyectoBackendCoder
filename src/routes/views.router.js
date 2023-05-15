import { Router } from "express";
import ProductManagerMongo from "../dao/managerMongo/productMongo.js";
import {carts} from "../routes/cart.router.js"
//import ProductManager from '../dao/manager/productManager.js';

const router = Router();
const pm = new ProductManagerMongo();
//const pm = new ProductManager();


router.get('/products', async (req,res) =>{
    //para visualizar todos los productos con su respectiva paginación.
    let { limit,page = 1,category,disp,sort } = req.query;
    const productos = await pm.getProducts(limit,page,category,disp,sort);
    res.render('products', {productos});
})

router.get('/carts/:cid', async (req,res) =>{
    //para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito. 
    let id = req.params.cid;
    let cart = await carts.getCartById(id)
    res.render('cart', {cart});
})


router.get('/', async (req,res)=>{
    let { limit,page } = req.query;
    const {docs}= await pm.getProducts(limit, page);
    const productos = docs
    res.render('home', {productos});
})


router.get('/chat', async (req,res)=>{
    res.render('chat', {});
})

router.get('/realtimeproducts' , async (req,res)=>{
    
    const productos = await pm.getP()
    res.render("realTimeProducts", {productos});
})

export default router;