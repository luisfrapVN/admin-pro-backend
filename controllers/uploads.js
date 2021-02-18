const { respone, response } = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res = respone) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "Tipo incorrecto debe ser hospitales, medicos o usuarios",
    });
  }

  //Validar que existe un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No files were uploaded.",
    });
  }

  //Procesar una imagen
  const file = req.files.imagen;
  // console.log(file);
  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Validar extension
  const extensionValida = ["png", "jpg", "jpeg", "gif"];
  if (!extensionValida.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "Extension incorrecta, debe ser png, jpg, jpeg, gif",
    });
  }

  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  //Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Mover la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "No se pudo mover la imagen",
      });
    }

    ///Actualizar la base de datos - helpers
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo subido",
      nombreArchivo,
    });
  });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador - subida imagenes",
    });
  }
};

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  //Imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-image.png`);
    res.sendFile(pathImg);
  }
};
module.exports = {
  fileUpload,
  retornaImagen,
};
