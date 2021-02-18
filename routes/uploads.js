/*
Ruta: /api/uploads
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { model } = require("mongoose");
const { fileUpload, retornaImagen } = require("../controllers/uploads");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const expressFileUpload = require("express-fileupload");

const router = Router();

router.use(expressFileUpload());
router.put("/:tipo/:id", validarJWT, fileUpload);
router.get("/:tipo/:foto", retornaImagen);

module.exports = router;
