import { Router } from 'express';
import ProductManagerMongo from '../dao/managerMongo/productMongo.js'
//import ProductManager from '../dao/manager/productManager.js';

const router = Router();
const productManager = new ProductManagerMongo()
//const productManager = new ProductManager();

router.get('/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        console.log( id)
        const produc = await productManager.getProductsId(id);
        res.send({mensaje:"Producto id",products: produc})
    } catch (error) {
        res.status(500).send({status:"error", error:error.message})
    }  
})

router.get('/', async (req,res) =>{
    try{
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        //console.log(limit)
        
        if(limit){
            const productLimit = products.slice(0, limit)
            res.send({mensaje: "productos limit",products: productLimit})
            return
        }
        
        res.send( {mensaje:"Todos los productos", products: products})
    }catch (error){
        res.status(500).send({status:"error", error:error.message})
    }

})

router.post('/', async (req,res)=> {
    try{
        const {title, description, price, thumbnail, code, stock, category, status} = req.body
        const producto = await productManager.addProduct(title,description,price,thumbnail,code,stock, category, status)
        
        if (producto.status === "error") {
            return res.status(404).send({
                status: "error",
                error: producto,
            });
        }
        res.send({status: 'Success', mensaje:"Products", producto})    
    }catch (error){
        res.status(500).send({status:"error", error:error.message})
    }
})

router.put('/:id', async (req,res)=> {
    try{
        const { body } = req;
        const { id } = req.params;
        const producto = await productManager.updateProduct(id, body);
        res.status(200).send({mensaje: "Producto actualizado",producto})

    }catch (error){
        res.status(500).send({status:"error", error:error.message})
    }
})

router.delete("/:id", async (req, res) => {
    try{
        const id = req.params.id
        const producto = await productManager.deleteProduct(id)
        res.send({status: 'Success', mensaje:"Product eliminado", producto})    
    } catch (error) {
        res.status(500).send({status:"error", error:error.message})
    }  
})

export default router;