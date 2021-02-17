require("dotenv").config();
const express = require("express"); //Similar a hacer una importacion
const cors = require("cors");

const { dbConnection } = require("./database/config");

//Crear servidor express

const app = express();

//Configurar CORS
app.use(cors());

//Base de datos
dbConnection();

//Rutas
app.get("/", (request, response) => {
  response.json({
    ok: true,
    msg: "Hola mundo",
  });
}); // <-- Lo que se ejecuta cuando alguien hace una llamada

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});
