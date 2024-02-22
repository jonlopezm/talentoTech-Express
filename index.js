const express = require('express');// Importar express
const app = express();// Crear una aplicacion express
const router = express.Router();// Crear un router
const port = 3000;// Puerto de escucha
require('dotenv').config();// Importar variables de entorno

const socket = require('socket.io');// Importar socket.io
const http = require('http');
const server = http.createServer(app);
const io = socket(server);// Crear un servidor de socket.io


const DB_URL = process.env.DB_URL;// Importar la URL de la base de datos
const mongoose = require('mongoose'); // Import mongoose
mongoose.connect(DB_URL);


const userRoutes = require('./routes/UserRoutes');
const houseRoutes = require('./routes/HouseRoutes');

//Metodo [GET, POST, PUT, PATCH, DELETE]
// Nombre del servicio [/]
router.get('/', (req, res) => {
    //Informacion a modificar
    res.send("Hello world")
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        socket.emit('chat message', 'Mensaje recibido: ' + msg);// Emitir un mensaje a todos los clientes
    }) 
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})


app.use(express.urlencoded({extended: true})) // Acceder a la informacion de las urls
app.use(express.json()) // Analizar informacion en formato JSON
app.use((req, res, next) => {
    res.io = io;
    next();
})// Middleware para acceder a io en los controladores
// Rutas
app.use(router);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/houses', express.static('uploads'));
app.use('/', userRoutes);
app.use('/', houseRoutes);
server.listen(port, () => {
    console.log('Listen on '+ port);
})