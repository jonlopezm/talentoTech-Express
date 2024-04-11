const express = require('express');// Importar express
const app = express();// Crear una aplicacion express
const router = express.Router();// Crear un router
const port = 3010;// Puerto de escucha
require('dotenv').config();// Importar variables de entorno

const socket = require('socket.io');// Importar socket.io
const cors = require('cors');// Importar cors
app.use(cors());// Usar cors
const http = require('http');
const server = http.createServer(app);
const io = socket(server);// Crear un servidor de socket.io

//GraphQL
const { createYoga } = require('graphql-yoga');
const schema = require('./graphql/schema');


// Importar la URL de la base de datos
const DB_URL = process.env.DB_URL;// Importar la URL de la base de datos
const mongoose = require('mongoose'); // Import mongoose
mongoose.connect(DB_URL);

// Importar rutas
const userRoutes = require('./routes/UserRoutes');
const houseRoutes = require('./routes/HouseRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const departmentRoutes = require('./read_file');

// Importar modelos
const messageSchema = require('./models/Message');


//Metodo [GET, POST, PUT, PATCH, DELETE]
// Nombre del servicio [/]
router.get('/', (req, res) => {
    //Informacion a modificar
    res.send("Hello world")
})

/** Metodos websocket */
io.on('connect', (socket) => {
    console.log("connected")
    //Escuchando eventos desde el servidor
    socket.on('message', (data) => {
        /** Almacenando el mensaje en la BD */
        var payload = JSON.parse(data)
        console.log(payload)
        messageSchema(payload).save().then((result) => {
            socket.broadcast.emit('message-receipt', result)
        }).catch((err) => {
            console.log({"status" : "error", "message" :err.message})
        })        
    })

    socket.on('disconnect', (socket) => {
        console.log("disconnect")    
    })
})


app.use(express.urlencoded({extended: true})) // Acceder a la informacion de las urls
app.use(express.json()) // Analizar informacion en formato JSON
app.use((req, res, next) => {
    res.io = io;
    next();
})// Middleware para acceder a io en los controladores


//GraphQL
const yoga = new createYoga({ schema });
app.use('/graphql', yoga);


// Rutas
app.use(router);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/houses', express.static('uploads'));
app.use('/', userRoutes);
app.use('/', houseRoutes);
app.use('/', messageRoutes)
app.use('/', departmentRoutes)

server.listen(port, () => {
    console.log('Listen on '+ port);
})

module.exports = server;