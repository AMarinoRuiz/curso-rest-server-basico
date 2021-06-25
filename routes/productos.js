const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { existeCategoriaNombre, existeProducto, productoActivo } = require('../helpers/db-validators');

const { validarCampos,
    validarJWT,
    esAdminRole,
} = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
], obtenerProducto)


router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria').custom(existeCategoriaNombre),
    validarCampos
], crearProducto)

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
],actualizarProducto)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id').custom(existeProducto),
    check('id').custom(productoActivo),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
],borrarProducto)

module.exports = router;