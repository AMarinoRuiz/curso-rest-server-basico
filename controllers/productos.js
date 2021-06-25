const { response } = require("express");
const { Producto, Categoria } = require("../models");

const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre'),
    ]);

    res.json({
        total,
        productos,
    })

}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    if (producto) {
        return res.status(200).json(producto);
    }

}

const crearProducto = async (req, res = response) => {
    // const nombre = req.body.nombre.toUpperCase();
    let { nombre, categoria } = req.body;
    nombre = nombre.toUpperCase();
    categoria = categoria.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`,
        });
    }


    categoria = await Categoria.findOne({ nombre: categoria });

    // Generar la data a guardar
    const data = {
        nombre,
        categoria: categoria._id,
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    let { nombre, categoria, descripcion, disponible } = req.body;
    nombre = nombre.toUpperCase();
    categoria = categoria.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });
    if (productoDB?._id != id) {
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe`,
        });
    }

    const categoriaDB = await Categoria.findOne({ nombre: categoria });
    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoria} no existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        categoria: categoriaDB._id,
        descripcion,
        disponible,
        usuario: req.usuario._id,
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json(producto);

}


const borrarProducto = async (req, res = response) => {

    const { id } = req.params;

    const data = {
        estado: false,
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
}