const userSchema = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

class  UserController{

    constructor(){}

    async login(email, password) {
        try {
            const user = await userSchema.findOne({ email: email });
            if (!user) {
                return { "Status": "Error", "message": "Usuario no encontrado" };
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return { "Status": "Error", "message": "Error en la contraseña" };
            }

            const  token = jwt.sign({ id: user._id, email : user.email}, JWT_SECRET, { expiresIn: '1h'});

          //return { "Status": "Success", "message": "Usuario logueado" };
            return { "Status": "Success", "token": token };

        } catch (error) {
            console.log(error);
            return { "Status": "Error", "message": "Error en el servidor" };
        }

    }

    validateToken(req, res, next){
        const tokenBearer = req.headers['authorization'];
        if (!tokenBearer) {
            return res.status(401).send({ "Status": "Error", "message": "No autorizado" });
        }
        const token = tokenBearer.startsWith('Bearer ') ? tokenBearer.slice(7, tokenBearer.length) : tokenBearer;

        jwt.verify(token, 'secreto', (err, decoded) => {
            if (err) {
                return res.status(401).send({ "Status": "Error", "message": "No autorizado" });
            }
            req.userId = decoded.id;
            next();
        });
    }
}

module.exports =  UserController;