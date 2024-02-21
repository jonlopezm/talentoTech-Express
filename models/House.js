const mongoose = require('mongoose');


const houseSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        validate: {
            validator: function (state) {
                const departamentosColombia = [
                    "AMAZONAS",
                    "ANTIOQUIA",
                    "ARAUCA",
                    "ATLÁNTICO",
                    "BOLÍVAR",
                    "BOYACÁ",
                    "CALDAS",
                    "CAQUETÁ",
                    "CASANARE",
                    "CAUCA",
                    "CESAR",
                    "CHOCÓ",
                    "CÓRDOBA",
                    "CUNDINAMARCA",
                    "GUAINÍA",
                    "GUAIVARE",
                    "HUILA",
                    "LA GUAJIRA",
                    "MAGDALENA",
                    "META",
                    "NARIÑO",
                    "NORTE DE SANTANDER",
                    "PUTUMAYO",
                    "QUINDÍO",
                    "RISARALDA",
                    "SAN ANDRÉS Y PROVIDENCIA",
                    "SANTANDER",
                    "SUCRE",
                    "TOLIMA",   
                    "VALLE DEL CAUCA",
                    "VAUPÉS",
                    "VICHADA"
                ];
                return departamentosColombia.includes(state.toUpperCase());
            },
            message: props => `${props.value} no es un departamento valido!`
          }  
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    rooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    parking: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (code) {
                return /^[a-zA-Z]{4}[0-9]{4}$/.test(code);
            },
            message: props => `${props.value} no es un codigo valido!`
          }        
    },
    image: {
        type: String,
        required: true
    }
});

const House = mongoose.model('House', houseSchema);

module.exports = House;
