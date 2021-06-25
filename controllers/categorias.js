const { response } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total - populate 
const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categoria] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre'),
    ]);

    res.json({
        total,
        categoria,
    })

}

// obtenerCategoria - populate 
const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (categoria) {
        return res.status(200).json(categoria);
    }

}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`,
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria (recibiendo nombre origen y uno nuevo)
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`,
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    // console.log(categoria);
    res.json(categoria);

}


// borrarCategoria - estado: false
const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const data = {
        estado: false,
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
}