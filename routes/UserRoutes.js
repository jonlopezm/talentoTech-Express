const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userSchema = require('../models/User.js');
const UserController = require('../controllers/UserController.js');
const multer = require('multer');
const userController = new UserController();



router.get('/user', /*userController.validateToken,*/ async (req, res) => {
    let users = await userSchema.find();
    res.json(users)
})

router.get('/user/:id', async (req, res) => {
    var id = req.params.id;
    let user = await userSchema.findById(id);
    res.json(user);

    //Traer un usuario pasandole el email
    // const query = UserSchema.where({ email: email });
    // const user = await query.findOne()

})


router.post('/user', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let user = userSchema({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id,
        //avatar: req.body.avatar,
        password: hashedPassword
    })
    user.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
        if (err.code == 11000) {
            res.send({ "status": "error", "message": err.message })
        } else {
            res.send({ "status": "error", "message": "Error almacenando la informacion" })
        }
    })
})



router.patch('/user/:id', userController.validateToken,async (req, res) => {
    try {
        var id = req.params.id;
        let hashedPassword

        if (req.body.password) {
            hashedPassword = await bcrypt.hash(req.body.password, 10)
        }

        var updateUser = {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            id: req.body.id,
        }

        console.log(updateUser);
        userSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
            res.send(result);
        }).catch((error) => {
            console.log(error);
            res.status(404).send("Error actualizando el registro");
        })
    }
    catch (error) {
        res.status("Error");
    }
})

// router.delete('/user/:id', (req, res) => {
//     var id = req.params.id;
//     userSchema.findByIdAndDelete(id).then((result) => {
//         res.json({ "status": "success", "message": "Usuario eliminado 1" });
//     }).catch((error) => {
//         console.log(error);
//         res.status(404).send("Error eliminando el registro");
//     })
// })


router.delete('/user/:id', userController.validateToken, (req, res) => {
    var id = req.params.id;
    userSchema.deleteOne({ _id: id }).then(() => {
        res.json({ "status": "success", "message": "Usuario eliminado 2" });
    }).catch((error) => {
        console.log(error);
        res.json({ "status": "error", "message": "Error eliminando el usuario" });
    })
})


router.delete('/user/:name/:email?', (req, res) => {
    var name = req.params.name;
    var email = req.params.email;
    var query;

    if (email != null) {
        query = { name: name, email: email }
    }
    else {
        query = { name: name }
    }
    userSchema.deleteOne(query).then(() => {
        res.json({ "status": "success", "message": "Usuario eliminado" });
    }).catch((error) => {
        console.log(error);
        res.json({ "status": "error", "message": "Error eliminando el usuario" });
    })
})

router.post('/user/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    userController.login(email, password).then((result) => {
        if(result.status == "error"){
            res.status(401).send(result)
        }else{
            res.send(result)
        }
    }).catch((error) => {
        res.send(error);
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('No es una imagen'));
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload/:id/user', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ 'status': 'Error', 'message': 'No se ha subido ningun archivo' });
    }
    var id = req.params.id;
    var updateUser = {
        avatar: req.file.path
    }

    userSchema.findByIdAndUpdate(id, updateUser,{new : true}).then((result) => {
        res.send({ "status": "success", "message": "Archivo subido correctamente" });
    }).catch((error) => {
        console.log(error);
        res.send({ "status": "error", "message": "Error subiendo el archivo" });
    })

})

module.exports = router;