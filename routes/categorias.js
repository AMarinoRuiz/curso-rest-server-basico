const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria, categoriaActiva } = require('../helpers/db-validators');

const { validarCampos,
    validarJWT,
    esAdminRole,
} = require('../middlewares');

const router = Router();


// Obtener todas las categorías - público
router.get('/', obtenerCategorias)

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
], obtenerCategoria)



// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar registro por id - privado - cualquiera persona con token válido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre').not().isEmpty(),
    validarCampos,
],actualizarCategoria)

// Borrar una categoría - ADMIN
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id').custom(existeCategoria),
    check('id').custom(categoriaActiva),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
],borrarCategoria)





module.exports = router;