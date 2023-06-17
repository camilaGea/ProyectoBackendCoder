import ProductManagerMongo from "../dao/managerMongo/productMongo.js";

const pm = new ProductManagerMongo();

export const realtimeproducts =async (req, res) => {
    const productos = await pm.getP()
    res.render("realTimeProducts", {productos});
}