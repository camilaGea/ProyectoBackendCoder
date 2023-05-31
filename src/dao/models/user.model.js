import mongoose from 'mongoose';


const userCollection = 'users'

const schema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    apellido:{
        type: String,
        require: true
    },
    edad:{
        type: Number,
        require: true
    },
    rol:{
        type: String,
        default: "usuario"
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    }
})

const userModel = mongoose.model(userCollection, schema)

export default userModel;