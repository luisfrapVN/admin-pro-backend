const { Schema, model } = require("mongoose");

const HospitalSchema = Schema(
  {
    nombre: { type: String, required: true },
    img: { type: String },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    collection:
      "hospitales" /*Asi le ponemos el nombre que queramos en mongodb, si no saldria hospitalS*/,
  }
);

HospitalSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject(); // <-- Extraemos la version, contraseña y el id de la instancia de ese objeto
  return object;
});

module.exports = model("Hospital", HospitalSchema); // <-- Exponemos este modelo hacia afuera
