
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token la petición',
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario al que corresponde el uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).jason({
                msg: 'Token no válido',
            })
        }

        // verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).jason({
                msg: 'Token no válido',
            })
        }



        req.usuario = usuario;

        next();
    } catch (err) {

        console.log(err);
        res.status(401).json({
            msg: 'Token no válido',
        })

    }




}

module.exports = {
    validarJWT,
}