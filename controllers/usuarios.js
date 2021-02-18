const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  // const usuarios = await Usuario.find({}, "nombre email rol google") //"FILTRAMOS" los datos para solo recibibr los que interesan
  //   .skip(desde)
  //   .limit(5); //Cuantos va a mostrar desde skip

  // const total = await Usuario.count();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email rol google img") //"FILTRAMOS" los datos para solo recibibr los que interesan
      .skip(desde)
      .limit(5), //Cuantos va a mostrar desde skip
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  }); // <-- Lo que se ejecuta cuando alguien hace una llamada
};

const crearUsuarios = async (req, res = response) => {
  //   console.log(req.body);
  const { email, password, nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }
    const usuario = new Usuario(req.body);

    //Encriptar contraseña npm i bcryptjs
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar usuario
    await usuario.save();
    /*
  Graba en la base de datos. Es una promesa, necesito esperar a que termine la misma para seguir la ejecucion
  Para ello ponemos como async la funcion y a esta llamada le añadimos el await
  */
    //Generar el token JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    }); // <-- Lo que se ejecuta cuando alguien hace una llamada
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "error inesperado, revisar logs" });
  }
};

const actualizarUsuarios = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    //TODO Validar token y comprobar si user correcto

    //Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }
    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }
    await Usuario.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "Usuario eliminiado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuarios,
  borrarUsuario,
};
