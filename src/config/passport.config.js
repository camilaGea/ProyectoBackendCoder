import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import {createHash, validatePassword} from '../utils.js'

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { nombre, apellido, email, edad } = req.body;
            try {
                const user = await userModel.findOne({email:username}); 
                if(user){
                    console.log('El usuario existe');
                    return done(null,false);
                }
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
                    password: createHash(password)
                }

                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });
    passport.deserializeUser( async (id, done)=>{
        const user = await userModel.findById(id);
        done(null, user)
    });
    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{

        try {
           
           const user = await userModel.findOne({email:username})
           //console.log(user);
            if(!user){
                console.log('No existe el usuario');
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            return done(null,user);

        } catch (error) {
            
            return done("Error al intentar ingresar: " + error);
            
        }

    }))


}

export default initializePassport;