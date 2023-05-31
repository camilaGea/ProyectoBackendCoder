import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req, res) =>{
    /*
    if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
        const user = {
            nombre, apellido, email, edad, password , rol: 'admin'
        };
        const result = await userModel.create(user);
    }else{
        const user = {
            nombre, apellido, email, edad, password 
        };
        const result = await userModel.create(user);
    }
    */

    res.send({status:"succes", message:"User registered"});

})

router.post('failregister', async(re,res)=>{
    console.log('Fallo en el ingreso');
    res.send({error: 'Error en el ingreso'})
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req,res)=>{
  
    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});

    req.session.user = {
        nombre: req.user.nombre,
        email: req.user.email,
        edad: req.user.edad,
        rol: req.user.rol
    }
    res.send({status:"success", payload:req.user, message:"Primer logueo!!"})
    
})

router.get('/faillogin', async (req,res)=>{

    console.log('Fallo en el ingreso');
    res.send({error: 'Error en el ingreso'})

})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/login');
    })
})

export default router;