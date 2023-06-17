import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
//import multer from 'multer';

// config Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Configuracion bcrypt - hash generation
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// validamos la contraseña con la que esta en la DB como hash
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

//JSON Web Tokens JWT functinos:
export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
export const generateJWToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '120s'});
};
export const authToken = (req, res, next) => {
    //El JWT token se guarda en los headers de autorización.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({error: "User not authenticated or missing token."});
    }
    const token = authHeader.split(' ')[1]; //Se hace el split para retirar la palabra Bearer.
    //Validar token
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: "Token invalid, Unauthorized!"});
        //Token OK
        req.user = credentials.user;
        console.log(req.user);
        next();
    });
};
export default __dirname;