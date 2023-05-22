import { Router } from 'express';
import ProductManagerMongo from '../dao/managerMongo/productMongo.js'
import productosModel from "../dao/models/product.model.js"
//import ProductManager from '../dao/manager/productManager.js';

const router = Router();
const productManager = new ProductManagerMongo()
//const productManager = new ProductManager();


router.get('/', async (req,res) =>{
    try{
        const products = await productManager.getProducts();
        let { limit,page,category,disp,sort } = req.query;
        console.log(limit)
        console.log(sort)
        console.log(query)

        const result = await productosModel.aggregate([
            {$match: {category: "oro"}},
            {$group: {_id:'$category', products: {$push: "$$ROOT"}}},
            {$sort:{_id: -1}},
            {$limit: 2}
        ])

        console.log(JSON.stringify(result, null, '\t'))
        /*
        if(!limit){
            const productLimit = products.slice(0, 10)
            res.send({mensaje: "productos limit",products: productLimit})
            return
        }
        const productLimit = products.slice(0, limit)
        */
        res.send({mensaje: "productos limit",products: products})
    }catch (error){
        res.status(500).send({status:"error", error:error.message})
    }

})


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