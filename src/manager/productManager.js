import fs from 'fs';
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../files/productos.json");

export default class ProductManager{
    constructor(){
        this.products = []
        this.idProduct = 1
        this.path = filePath
    }

    saveProduct = async () => {
        try{
            const productData = JSON.stringify(this.products, null , '\t');
            await fs.promises.writeFile(this.path, productData) //guardo los productos
        } catch(error){
            console.log(error)
        }
    }


    getProducts = async() => {
        if(fs.existsSync(this.path)){
            const productData =  await fs.promises.readFile(this.path, "utf-8"); //lee y devuelve los datos
            const prod = JSON.parse(productData);
            console.log(prod)
            return prod
        }else{
            console.log('[]')
            return []
        }
    }


    addProduct = async(title, description, price, thumbnail, code, stock, category, status) =>{
        
        if(!title || !description || !price || !code || !stock || !category){
            console.log('No ha llenado los datos (titulo-descripcion-precio-ruta-codigo-stock)')
            return
        }

        const codProduct = this.products.find(product => product.code === code )

        if(codProduct){
            console.log(`El codigo ${code} del producto ${title} ya esta registrado`)
            return
        }
        if(status === undefined){
            status = true
        }

        const product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            status: status,
            stock: stock,
            category: category,
            id: this.idProduct ++
        }
        
        this.products.push(product);
        console.log(`El producto ${title} agregado correctamente`)

        //guardado
        this.saveProduct()
    }

     getProductsById= async(id) =>{
        const productData = await fs.promises.readFile(this.path, "utf-8");
        const prod = JSON.parse(productData);
        const productoId = prod.find(product => product.id == id)
        if(productoId){
            return productoId
            //console.log( productoId)
        }else{
            return `El producto con ID: ${id} no encontrado`
            //console.log('Not found')
        }
    }


    updateProduct= async(id, campo) =>{
        const data = await fs.promises.readFile(this.path, "utf-8");
        const productos = JSON.parse(data);

        //obtengo el producto con el ID solicitado
        let producto = productos.find(producto => producto.id == id)

        //obtengo las keys del objeto con los values que queremos modificar del producto obtenido por el ID
        let keysProducto = Object.keys(campo);

        //Si el ID del producto no existe devuelvo un error 
        if(!producto){
            return null
        }
        for (const key of keysProducto){

            //si el producto a modificar tiene la/las keys a modificar le asigno los valores nuevos del objeto que le pasamos por parametro
            if(producto.hasOwnProperty(key)){
                producto[key] = campo[key]
            }
        }

        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
        return "El producto se actualizo correctamente"  
    }  

    deleteProduct = async(id)=>{
        const prod = await this.getProducts()
        const producto = prod.find(producto => producto.id == id)
        if(!producto){
            console.log(`El producto con id ${id} no existe`  )
            return
        }
        const indice = prod.indexOf(producto);
        this.products.splice(indice,1)       
        this.saveProduct()
    }
}
