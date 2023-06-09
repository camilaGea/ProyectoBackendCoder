import userModel from '../dao/models/user.model.js'
import { authToken, generateJWToken, validatePassword, createHash} from '../utils.js';
import { Router } from 'express';
import CartMongo from '../dao/managerMongo/cartMongo.js'

const router = Router();
const cart = new CartMongo()

router.post('/register', async (req, res) =>{
    const { nombre, apellido, email, edad, password } = req.body;
    try {
        const user = await userModel.findOne({email}); 
        if(user){
            console.log('El usuario existe');
            return res.status(401);
        }
            //creo el cart id
        let cartUser = await cart.addCart()
        console.log('cart'+ cartUser)

        if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
            const newUser = {
                nombre, apellido, email, edad, password: createHash(password) , rol: 'admin'
            }
            const result = await userModel.create(newUser);
            return done(null, result);
        }
  
        const newUser = {
            nombre, 
            apellido, 
            email, 
            edad,
            cart: cartUser._id,
            password: createHash(password)
        }

        const result = await userModel.create(newUser);
        let access_token  = generateJWToken(result);
  
        res.send({status:"success", access_token })
    }catch (error) {
        return res.send({mensaje:"Error al registrar el usuario: " + error});
    }
    
})

router.post('failregister', async(re,res)=>{
    console.log('Fallo en el ingreso');
    res.send({error: 'Error en el ingreso'})
})

router.post('/login', async (req,res)=>{
    let { email, password } = req.body;
    
    if (!email || !password) return res.status(401).send({menssage: "credenciales incorrectas"});
  
    let usuario = await userModel.findOne({ email: email });
    
    if (!usuario) return res.status(401).send({menssage: "usuario no existe"});
    if (!validatePassword(password, usuario)) return res.status(401).send({menssage: "cedenciales incorrectas"});
  
    let { nombre, apellido, edad } = usuario;
    let rol = email === "adminCoder@coder.com" && password === "adminCod3r123" ? "admin" : "user";
    
    let user = {
      nombre,
      apellido,
      email,
      edad,
      rol,
      cart: cart
    };
    console.log(user)
    let access_token  = generateJWToken(user);    
    res.send({status:'success', access_token})

    /*
    // Con Cookies
    res.cookie('jwtCookieToken', access_token , {
    maxAge: 3600000, //una hora
    httpOnly: false // expone la cookie
    //httpOnly: true // No expone la cookie
    })
    */

})

router.get('/current', authToken, (req,res)=>{
    console.log(req.user)
    res.send({status:"success", payload:req.user})
})
export default router