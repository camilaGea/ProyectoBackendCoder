import cartModel from "../models/cart.model.js"

export default class CartMongo{

    async getCarts (){
        try{
            return await cartModel.find()
        }catch(error){
            return { status: "error", error: error };
        }
    }

    async addCart(){
        try{
            return await cartModel.create({})
        }catch(error){
            return { status: "error", error: error };
        }
    }

    async getCartById(cid){
        try{
            return await cartModel.findOne({_id: cid})
        }catch(error){
            return { status: "error", error: error }; 
        }
    }

    async addProductInCart (cid, pid){
        try{
            let cart = await cartModel.findOne({ _id: cid })
            const product = cart.product.find((prod) => prod.idProduct._id == pid)
            if(product){
                return await cartModel.updateOne({_id:cid,'product.idProduct': pid}, {$inc: {'product.$.quantity': 1}})
            }else{
                return await cartModel.updateOne({_id:cid}, {$push: {product: {idProduct: pid , quantity: 1}}})
            }
        }catch(error){
            return { status: "error", error: "no se pudo realizar el metodo" }; 
        }
    }

}