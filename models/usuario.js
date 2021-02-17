const { Schema, model } = require("mongoose");

const UsuarioScheme = Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String },
  rol: { type: String, required: true, default: "USER_ROLE" },
  google: { type: Boolean, default: false },
});

UsuarioScheme.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject(); // <-- Extraemos la version, contraseña y el id de la instancia de ese objeto
  object.uid = _id; // <-- Añadimos el ID con otro nombre, en este caso uid
  return object;
});

module.exports = model("Usuario", UsuarioScheme); // <-- Exponemos este modelo hacia afuera
