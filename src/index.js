import express from "express";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import { Server } from "socket.io";
import ProductManager from "./manager/productManager.js"

const pm = new ProductManager();

const PORT = 8080;
const app = express();
const server = app.listen(PORT, ()=>{console.log('servidor funcionando en e puerto ' + PORT)});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const socketServer = new Server(server)

socketServer.on('connection',  socket =>{
    console.log('Usuario conectado');

    //agregar producto
    socket.on("newProduct", async(data) =>{ //escucho lo que me manda el cliente
        //console.log('hola')
        let producto = await pm.addProduct(data.title, data.description, data.price, data.thumbnail ,data.code, data.stock,data.category, data.status)
        if (producto.status === "error"){ //si el codigo esta repetido o no cargo todos los datos
            let mens = producto.message
            return socketServer.emit("productAdd", { status: "error", message: mens}) //envio al cliente el error  
        }
        const dataActualizada = await pm.getProducts();// cargo todo correcto
        return socketServer.emit("productAdd", dataActualizada) // envio al cliente los productos actualizados con el reciente cargado
    }) 

    //eliminar Producto
    socket.on("productDelete", async (pid) =>{ //escucho lo que me manda el cliente
        //console.log(pid.id)
        const id = await pm.getProductsById(pid.id) //busco el producto con ese id
        //console.log(id)
        if(id){
            await pm.deleteProduct(pid.id); //elimino el producto con el id enviado desde el cliente
            const data = await pm.getProducts(); // traigo los productos actualizados
            return socketServer.emit("newList", data); // le mando los productos sin el eliminado
        }
        if(!id){
            socketServer.emit("newList", { status: "error", message: `No se encontro el producto con id ${pid.id}` })
        }
    }) 

})