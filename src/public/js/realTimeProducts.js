const socket = io();
console.log("cliente conectado");


//agregar producto

const formAdd = document.getElementById("addProduct");
//const product = document.querySelectorAll("input");
const title = document.getElementById("title");
const price = document.getElementById("price");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const description = document.getElementById("description");
const statuss = document.getElementById("status");
const thumbnail = document.getElementById("thumbnail");

formAdd.addEventListener("submit", (e) => {
    e.preventDefault();

    socket.emit("newProduct", { //envio el id producto a eliminar desde el Cliente al Servidor
        title: title.value,
        price: price.value,
        code: code.value,
        stock: stock.value,
        category: category.value,
        description: description.value,
        status: statuss.value,
        thumbnail: thumbnail.value,
    });
});

socket.on("productAdd", (data) => {
    if (data.status === "error") {
        return console.log(data.message);
    }
    let list = "";
    data.forEach(({ _id, title, price, code, stock, category, description, status }) => {
        list += `<tr>
        <td>${_id}</td>
        <td>${title}</td>
        <td>${price}</td>
        <td>${code}</td>
        <td>${stock}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${status}</td>
        </tr>`;
    });

    const listaAct =
        `
    <tr>
    <th scope="col">ID</th>
    <th scope="col">Name</th>
    <th scope="col">Price</th>
    <th scope="col">code</th>
    <th scope="col">stock</th>
    <th scope="col">category</th>
    <th scope="col">description</th>
    <th scope="col">status</th>
    </tr>` + list;
    document.getElementById("tableProduct").innerHTML = listaAct;
});




//eliminar producto
const formDelete = document.getElementById("formDelete");
const id = document.getElementById("deleteProd");

formDelete.addEventListener("submit", (evt) => {
    evt.preventDefault();
    socket.emit("productDelete", { _id: id.value }); //envio el id producto a eliminar desde el Cliente al Servidor
});

socket.on("newList", (data) => { //escucho lo que me envia el servidor 
    if (data.status === "error") {
        return console.log(data.message);
    }
    let list = "";
    data.forEach(({ _id, title, price, code, stock, category, description, status }) => {
        list += `
                    <tr>
                    <td>${_id}</td>
                    <td>${title}</td>
                    <td>${price}</td>
                    <td>${code}</td>
                    <td>${stock}</td>
                    <td>${category}</td>
                    <td>${description}</td>
                    <td>${status}</td>
                    </tr>`;
    });
    //console.log(list);
    const listAct =
        ` <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">code</th>
            <th scope="col">stock</th>
            <th scope="col">category</th>
            <th scope="col">description</th>
            <th scope="col">status</th>
            </tr>` + list;
    document.getElementById("tableProduct").innerHTML = listAct;
});