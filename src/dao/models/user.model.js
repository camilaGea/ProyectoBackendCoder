import mongoose from 'mongoose';


const userCollection = 'users'

const schema = new mongoose.Schema({
    nombre:{
        type: String,
        
    },
    apellido:{
        type: String,
        
    },
    edad:{
        type: Number,
        
    },
    rol:{
        type: String,
        default: "usuario"
    },
    email:{
        type: String,
        
        unique: true
    },
    password:{
        type: String,
        
    }
})

const userModel = mongoose.model(userCollection, schema)

export default userModel;