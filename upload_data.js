const xlsx = require('xlsx');
require('dotenv').config();
const bycrypt = require('bcrypt');

const DB_URL = process.env.DB_URL;
const mongoose = require('mongoose');
mongoose.connect(DB_URL);
const userSchema = require('./models/User');


const workbook = xlsx.readFile('datos.xlsx');
const sheet_name_list = workbook.SheetNames;
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);


for(const user of data){
    const hashedpassword = bycrypt.hashSync(user.password, 10);
    user.password = hashedpassword;

    userSchema({
        name: user.name,
        lastname: user.lastname,
        email : user.email,
        id : user.id,
        password : user.password,
        avatar : user.avatar
    }).save().then(() => {
        console.log("Data inserted successfully "+ user.name);
    }).catch((err) => {
        console.log("Error inserting data" + err.message);
    })
}

// userSchema.insertMany(data).then(() => {
//     console.log("Data inserted successfully");
// }).catch((err) => {
//     console.log(err);
// })
