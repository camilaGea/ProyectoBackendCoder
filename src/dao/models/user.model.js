import mongoose from 'mongoose';
import { Schema} from "mongoose";
<<<<<<< HEAD
=======

>>>>>>> 9ca520c97330d813cc09299721ad465de5dccb39

const userCollection = 'users'

const userSchema = new mongoose.Schema({
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
    },
<<<<<<< HEAD
    cart:{
        type: Schema.Types.ObjectId,
        ref: 'carts',
        require: true
    }
})


=======
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        require: true
    },
})

>>>>>>> 9ca520c97330d813cc09299721ad465de5dccb39
userSchema.pre('find', function(){
    this.populate('cart')
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel;