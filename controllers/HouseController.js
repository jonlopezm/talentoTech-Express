const userSchema = require('../models/House');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


class  HouseController{
    constructor(){}
}

module.exports =  HouseController;