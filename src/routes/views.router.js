import { Router } from "express";
import ProductManagerMongo from "../dao/managerMongo/productMongo.js";
//import ProductManager from '../dao/manager/productManager.js';

const router = Router();
const pm = new ProductManagerMongo();
//const pm = new ProductManager();


router.get('/', async (req,res)=>{
    const productos = await pm.getProducts();
    console.log(productos)
    res.render('home', {productos});
})


router.get('/chat', async (req,res)=>{
    res.render('chat', {});
})

router.get('/realtimeproducts' , async (req,res)=>{
    const productos = await pm.getProducts();
    res.render("realTimeProducts", {productos});

})

export default router;