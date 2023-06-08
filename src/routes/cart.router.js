import { Router } from "express";
import CartMongo from "../dao/managerMongo/cartMongo.js"
import ProductManagerMongo from "../dao/managerMongo/productMongo.js"
import cartModel from "../dao/models/cart.model.js";
//import CartManager from "../dao/managerFileSystem/cartManager.js";

const router = Router()
export const carts = new CartMongo()
const products = new ProductManagerMongo()
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
    const cid =  req.params.cid;
    const pid = req.params.pid;
    
    const product = await products.getProductsId(pid)
    const cart = await carts.getCartById(cid);

    if(!cart || cart.status === "error"){
        return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
    }
    if(!product || product.status === "error"){
        return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
    }

    const result = await carts.addProductInCart(cid,pid);
    res.status(200).send({status:"sucess", result})

   }catch (error) {
    res.status(500).send({status:"error", error: "Ha ocurrido un error al agrgar el carrito"})
   }
})

router.delete('/:cid/products/:pid', async (req,res) =>{
    //deberá eliminar del carrito el producto seleccionado.
    try{
        const cid =  req.params.cid;
        const pid = req.params.pid;
        const product = await products.getProductsId(pid)
        const cart = await carts.getCartById(cid);

        if(!cart || cart.status === "error"){
            return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
        }
        if(!product || product.status === "error"){
            return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
        }
        const result = await carts.deleteProductInCart(cid,pid);

        res.status(200).send({status:"sucess", result})
    }catch(error){
        res.status(500).send({status:"error", error:error.message})
    }
})

router.put('/:cid', async(req,res)=>{
    // deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
    try{
        const cid = req.params.cid;
        const products = req.body;

        const cart = await carts.getCartById(cid);
        if(!cart || cart.status === "error"){
            return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
        }

        const result = await carts.updateProductInCart(cid, products)
        res.status(200).send({status:"sucess", result})

    }catch(error){
        res.status(500).send({status:"error", error:error.message})
    }

})
router.put('/:cid/products/:pid', async(req,res)=>{
    //deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
    const cid = req.params.cid
    const pid = req.params.pid
    //const qty = req.body
    const {quantity} = req.body

    const product = await products.getProductsId(pid)
    const cart = await carts.getCartById(cid);

    if(!cart || cart.status === "error"){
        return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
    }
    if(!product || product.status === "error"){
        return res.status(404).send({status: "error", error: `No existe el producto id ${pid}` })
    }

    console.log(quantity)

    const result = await carts.updateQtyProductInCart(cid, pid, quantity)
    res.status(200).send({status:"sucess", result})

})

router.delete('/:cid', async(req,res)=>{
    //deberá eliminar todos los productos del carrito
    const cid = req.params.cid
    const cart = await carts.getCartById(cid);

    if(!cart || cart.status === "error"){
        return res.status(404).send({status: "error", error: `No existe el carrito id ${cid}` })
    }

    const result = await carts.deleteProductsInCart(cid)
    res.status(200).send({status:"sucess", result})
})

export default router