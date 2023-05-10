import { Router } from "express";
import CartMongo from "../dao/managerMongo/cartMongo.js"
//import CartManager from "../dao/managerFileSystem/cartManager.js";

const router = Router()
const carts = new CartMongo()
//const carts = new CartManager()

router.post('/', async (req,res)=> {
    try {
        const carrito = await carts.addCart();
        res.status(201).send({status:"sucess", carrito})
    } catch (error) {
        res.status(500).send({status:"error", error:error.message})
    }    
})

router.get("/:cid", async (req,res) => {
    try{
        const id = req.params.cid
        const cart = await carts.getCartById(id);
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
    res.status(200).send({status:"sucess", result})

   }catch (error) {
    res.status(500).send({status:"error", error: "Ha ocurrido un error al agrgar el carrito"})
   }
})

export default router