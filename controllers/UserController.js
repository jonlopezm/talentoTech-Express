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
                return { "status": "error", "message": "Usuario no encontrado" };
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return { "status": "error", "message": "Error en la contraseña" };
            }

            const  token = jwt.sign({ userId: user._id, 
                                    email : user.email,
                                    avatar: user.avatar,
                                    fullName: `${user.firstName} ${user.lastName}`
                                }, JWT_SECRET, { expiresIn: '1h'});
            user.password = null;
          //return { "Status": "Success", "message": "Usuario logueado" };
            return { "status": "success", "token": token ,"user": user};

        } catch (error) {
            console.log(error);
            return { "status": "error", "message": "Error en el servidor" };
        }

    }

    validateToken(req, res, next){
        const tokenBearer = req.headers['authorization'];
        if (!tokenBearer) {
            return res.status(401).send({ "status": "error", "message": "No autorizado" });
        }
        const token = tokenBearer.startsWith('Bearer') ? tokenBearer.slice(7, tokenBearer.length) : tokenBearer;

        jwt.verify(token, 'secreto', (err, decoded) => {
            if (err) {
                return res.status(401).send({ "status": "error", "message": "No autorizado" });
            }
            req.userId = decoded.id;
            next();
        });
    }
}

module.exports =  UserController;