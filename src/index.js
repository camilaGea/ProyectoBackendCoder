import express from "express";
import handlebars from 'express-handlebars';
import { Server, Socket } from "socket.io";
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import ProductManagerMongo from "./dao/managerMongo/productMongo.js";
import MenssageMongo from "./dao/managerMongo/menssageMongo.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
//import ProductManager from "./dao/manager/productManager.js"

const pm = new ProductManagerMongo();
const ms = new MenssageMongo();
//const pm = new ProductManager();

const PORT = 8080;
const MONGO = 'mongodb+srv://camilagea4:tipa1527@cluster0.tuiclhb.mongodb.net/ecommerce?retryWrites=true&w=majority'
const app = express();
const server = app.listen(PORT, ()=>{console.log('servidor funcionando en e puerto ' + PORT)});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())

app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const io = new Server(server)

io.on('connection',  socket =>{
    console.log('Usuario conectado');

    //agregar producto
    socket.on("newProduct", async(data) =>{ //escucho lo que me manda el cliente
        let producto = await pm.addProduct(data.title, data.description, data.price, data.thumbnail ,data.code, data.stock,data.category, data.status)
        if (producto.status === "error"){ //si el codigo esta repetido o no cargo todos los datos
            let mens = producto.message
            return io.emit("productAdd", { status: "error", message: mens}) //envio al cliente el error  
        }
        const dataActualizada = await pm.getP();// cargo todo correcto
        console.log (dataActualizada)
        return io.emit("productAdd", dataActualizada) // envio al cliente los productos actualizados con el reciente cargado
    }) 
    
    //eliminar Producto
    socket.on("productDelete", async (pid) =>{ //escucho lo que me manda el cliente
        //console.log(pid.id)
        const id = await pm.getProductsId(pid) //busco el producto con ese id
        //console.log(id)
        if(id){
            await pm.deleteProduct(pid); //elimino el producto con el id enviado desde el cliente
            const dataActualizada = await pm.getP(); // traigo los productos actualizados
            return io.emit("newList", dataActualizada); // le mando los productos sin el eliminado
        }
        if(!id){
            io.emit("newList", { status: "error", message: `No se encontro el producto con id ${pid.id}` })
        }
    }) 

    //chat
    
    socket.on("message", async(data)  => {
        const NewMessage = await ms.addMenssage(data); 
        const messages = await ms.getMenssage();
        io.emit("messageLogs", messages)
    })

    socket.on("authenticated", data =>{
        socket.broadcast.emit("newUserConnected", data) //el broadcast envia el mesaje a todos los usuarios conectados menos a si mismo
    })
    
})

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO);
        console.log("Conexion con DB correcta")
    }catch (error){
        console.log(`Fallo al conectar con DB. Error: ${error}`)
    }
}

connectDB();