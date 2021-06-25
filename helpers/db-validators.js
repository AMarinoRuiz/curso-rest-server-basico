const {
    Categoria,
    Role,
    Usuario,
    Producto,
} = require('../models');
// const Role = require('../models/role');
// const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos.`);
    }
}

const emailExiste = async (correo = '') => {
    // verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado.`);
    }
}

const existeUsuarioPorId = async (id = '') => {
    // verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        // console.log(id);
        throw new Error(`El id ${id} no existe.`);
    }
}

const existeCategoria = async (id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe.`);
    }
}

const existeCategoriaNombre = async (nombre = '') => {
    nombre = nombre.toUpperCase();
    const existeCategoria = await Categoria.findOne({ nombre });
    if (!existeCategoria && nombre != '') {
        throw new Error(`La categoría con nombre ${nombre} no existe.`);
    }
}

const categoriaActiva = async (id = '') => {
    const categoria = await Categoria.findById(id);

    if (!categoria.estado) {
        throw new Error(`La categoría con id ${id} se encuentra inactiva`);
    }
}

const existeProducto = async (id = '') => {
    const producto = await Producto.findById(id);
    if (!producto) {
        throw new Error(`El id ${id} no existe.`);
    }
}

const productoActivo = async (id = '') => {
    const producto = await Producto.findById(id);

    if (!producto.estado) {
        throw new Error(`El producto con id ${id} se encuentra inactivo`);
    }
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeCategoriaNombre,
    categoriaActiva,
    existeProducto,
    productoActivo,
}