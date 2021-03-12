
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPost, usuariosDelete, usuariosPut, usuariosPatch } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
] , usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').not().isEmpty(),
    check('correo').custom( emailExiste ),
    check('correo').isEmail(),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROL','USER_ROL']),
    check('rol').custom( esRoleValido ),
    validarCampos
] , usuariosPost)

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete)

router.patch('/', usuariosPatch)




module.exports = router;

