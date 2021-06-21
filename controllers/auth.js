const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {

    const { correo, password } = req.body;

    try {

        // verificar si el mail existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos',
            })
        }
        // si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos',
            })
        }

        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos',
            })
        }
        // generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        })

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':dasdasP',
                img,
                google: true,
            };
            console.log(data);
            usuario = new Usuario(data);
            await usuario.save();

        }

        // si el usuario en DB tiene estado FALSO, no lo dejo entrar
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador; usuario bloqueado.',
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        })
    }
    catch (err) {
        // console.log(err);
        res.status(400).json({
            msg: 'Token de Google no es válido.',
        })
    }

}

module.exports = {
    login,
    googleSignIn,
}