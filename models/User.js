const mongoose = require('mongoose'); // Import mongoose

// Define your User schema and model here
const userSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (name) {
        // Expresión regular para validar el formato del correo electrónico
        return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name);
      },
      message: props => `${props.value} no es un correo electrónico válido!`
    }
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Expresión regular para validar el formato del correo electrónico
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} no es un correo electrónico válido!`
    }
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('User', userSchema);


