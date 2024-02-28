const mongoose = require('mongoose');
const fetch = require('node-fetch');

const houseSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        validate: {
            validator: async function (city) {
                var response = await fetch('https://api-colombia.com/api/v1/City');
                var cities = await response.json();
                return cities.some(object => object.name.toUpperCase().includes(city.toUpperCase()));
            },
            message: props => `${props.value} no es una ciudad valida de colombia!`
        }
    },
    state: {
        type: String,
        required: true,
        validate: {
            validator: async function (state) {
                var response = await fetch('https://api-colombia.com/api/v1/Department');
                var states = await response.json();
                return states.some(object => object.name.toUpperCase().includes(state.toUpperCase()));
            },
            message: props => `${props.value} no es un departamento valido de colombia!`
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


module.exports = mongoose.model('House', houseSchema);;
