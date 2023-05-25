import { Router } from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

router.post('/register', async (req, res) =>{

    const {nombre, apellido, email, edad, password} = req.body;

    const exist = await userModel.findOne({email});
    if(exist){
        return res.status(400).send({status:"error", error:"User already exists"});
    }
    const user = {
        nombre, apellido, email, edad, password
    };

    const result = await userModel.create(user);
    res.send({status:"succes", message:"User registered"});

})

router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email,password})

    if(!user){
        return res.status(400).send({status:"error", error:"Datos incorrectos"})
    }
  
    req.session.user = {
        nombre: `${user.nombre} ${user.apellido}`,
        email: user.email,
        edad: user.edad
    }
    res.send({status:"success", payload:req.res.user, message:"Primer logueo!!"})
    
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/login');
    })
})

export default router;