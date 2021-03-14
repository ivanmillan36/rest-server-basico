const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId, existeCategoria } = require('../helpers/db-validators');

const { validarJWT , validarCampos, esAdminRole} = require('../middlewares');

const router = Router();


// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id' , 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
] ,obtenerProducto);

// Crear producto - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    check('categoria' , 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
] , crearProducto );

// Actualizar - privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    //check('categoria' , 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,actualizarProducto);

// Borrar un producto - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id' , 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,borrarProducto);

module.exports = router;