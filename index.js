const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;
require('dotenv').config();
const DB_URL = process.env.DB_URL;


const mongoose = require('mongoose'); // Import mongoose
mongoose.connect(DB_URL);


const userRoutes = require('./routes/UserRoutes');
const houseRoutes = require('./routes/HouseRoutes');


app.use(express.urlencoded({extended: true})) // Acceder a la informacion de las urls
app.use(express.json()) // Analizar informacion en formato JSON

//Metodo [GET, POST, PUT, PATCH, DELETE]
// Nombre del servicio [/]
router.get('/', (req, res) => {
    //Informacion a modificar
    res.send("Hello world")
})


app.use(router);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/houses', express.static('uploads'));
app.use('/', userRoutes);
app.use('/', houseRoutes);
app.listen(port, () => {
    console.log('Listen on '+ port);
})