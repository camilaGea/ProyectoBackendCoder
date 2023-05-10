import productosModel from '../models/product.model.js'

export default class ProductManagerMongo {

    async getProducts(){
        try{
            return await productosModel.find()
        }catch (error){
            return { status: "error", error: error };
        }
    }

    async getProductsId(pid){
        try{
            return await productosModel.findOne({ _id: pid })
        }catch (error){
            return { status: "error", error: error };
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock, category, status){
        try{
            if(!title || !description || !price || !code || !stock || !category){
                return { status: "error", message: "No ha llenado los datos" }
            }
            const codProduct = await productosModel.findOne({code: code})
            console.log( codProduct)
            if(codProduct){
                return { status: "error", message: "codigo repetido!" }
            }

            if(status === undefined){
                status = true
            }

            const newProduct = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                status: status,
                stock: stock,
                category: category,
            }
            return await productosModel.create(newProduct)
        
        }catch (error){
            return { status: "error", error: error };
        }
    }

    async updateProduct(pid, cambio){
        try{
            return await  productosModel.updateOne({_id: pid} , cambio)
        }catch(error){
            return { status: "error", error: error };
        }
    }

    async deleteProduct(pid){
        try{
            return await productosModel.deleteOne({ _id: pid })
        }catch(error){
            return { status: "error", error: error };
        }
    }
}