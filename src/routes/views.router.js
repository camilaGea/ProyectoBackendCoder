import { Router } from "express";
import ProductManager from '../manager/productManager.js';

const router = Router();
const pm = new ProductManager();


router.get('/', async (req,res)=>{
    const productos = await pm.getProducts();
    res.render('home', {productos});
})

router.get('/realtimeproducts' , async (req,res)=>{
    const productos = await pm.getProducts();
    res.render("realTimeProducts", {productos});

})

export default router;