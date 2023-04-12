import { Router } from "express";
import CartManager from "../manager/cartManager.js";

const router = Router()
const carts = new CartManager()

router.post('/', async (req,res)=> {
    try {
        const carrito = await carts.create();
        res.status(201).send({status:"sucess", carrito})
    } catch (error) {
        res.status(500).send({status:"error", error:error.message})
    }    
})

router.get("/:cid", async (req,res) => {
    try{
        const id = req.params.cid
        const cart = await carts.getCartsById(id);
        res.send(cart);
    }catch(error){
        res.status(500).send({status:"error", error:error.message})
    }
})


router.post('/:cid/product/:pid', async (req,res)=> {
   try{
    const idCart =  req.params.cid;
    const idProd = req.params.pid;
    const result = await carts.addProductInCart(idCart,idProd);
    res.send(result)
   }catch (error) {
    res.status(500).send({status:"error", error:error.message})
   }
})

export default router