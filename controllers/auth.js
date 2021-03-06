const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");
const usuario = require("../models/usuario");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //Verificar email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro email/contraseña",
      });
    }

    //Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontro mail/contraseña",
      });
    }

    //Generar el token - jwt

    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.rol),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      //existe usuario
      usuario = usuarioDB;
      usuario.google = true;
      usuario.password = "@@@";
    }

    //Guardar en BD
    await usuario.save();

    //Generar el token - jwt
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuario.rol),
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Error token",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  //Generar el token - jwt
  const token = await generarJWT(uid);

  //Obtener el usuario por UID
  const usuario = await Usuario.findById(uid);
  res.json({
    ok: true,
    uid,
    usuario,
    menu: getMenuFrontEnd(usuario.rol),
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
