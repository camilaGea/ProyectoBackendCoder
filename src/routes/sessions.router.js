import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import {createHash, validatePassword} from '../utils.js'

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req, res) =>{
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

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{

    req.session.user = req.user;
    res.redirect('http://localhost:8080/products')

})


export default router;