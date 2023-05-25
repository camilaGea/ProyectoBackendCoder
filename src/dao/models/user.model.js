import mongoose from 'mongoose';


const userCollection = 'users'

const schema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    edad:{
        type: Number,
        required: true
    },
    rol:{
        type: String,
        default: "usuario"
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

const userModel = mongoose.model(userCollection, schema)

export default userModel;