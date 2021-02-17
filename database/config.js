const mongoose = require('mongoose');
const dbConnection = async () => {
  // <-- Al poner async hacemos que mande una promesa

  try {
    await mongoose.connect(process.env.DB_CNN
      ,
      {
        // <-- Con await esperamos a que esté todo para ejecutar respuesta
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );

    console.log("Db Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la BD ver logs");
  }
};

module.exports = {
  dbConnection,
};

// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
