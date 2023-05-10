import mongoose from 'mongoose';

const collection = 'products';

const schema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type: String,
        require: true
    },
    price:{
        type:Number,
        require:true
    },
    thumbnail:{
        type:[],
    },
    code:{
        type:Number,
        require:true
    },
    status:{
        type:Boolean,
    },
    stock:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    }
})

const productosModel = mongoose.model(collection, schema);

export default productosModel;