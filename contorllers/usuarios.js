const { response} = require('express');

const usuariosGet = (req, res = response) => {
    
    const {q, nombre='No name', apikey, page= 1, limit=10} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    })
}

const usuariosPut = (req, res) => {

    const {id} = req.params;
    res.json({
        msg: 'put API - controlador',
        id,
    })
}

const usuariosPost = (req, res) => {
    
    const {nombre,edad} = req.body;
    
    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad,
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - contorlador',
    })
}

module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
}