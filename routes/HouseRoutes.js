const express = require('express');
const router = express.Router();
const houseSchema = require('../models/House.js');
const HouseController = require('../controllers/HouseController.js');
const multer = require('multer');
const houseController = new HouseController();

router.get('/houses', async (req, res) => {
    let houses = await houseSchema.find();
    res.json(houses)
})


router.get('/houses/:id', async (req, res) => {
    var id = req.params.id
    let house = await houseSchema.findById(id);
    res.json(house);
})


router.post('/houses', async (req, res) => {
    let house = houseSchema({        
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        size: req.body.size,
        type: req.body.type,
        zipCode: req.body.zipCode,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
        code: req.body.code
        // image: req.body.image
    })
    house.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if (err.code === 11000) {
            res.send({ "status": "error", "message": "El codigo ya fue registrado" })
        } else   {
            console.log('Ocurrió un error:', err);
            res.send({ "status": "error", "message": err.message })
        }
    })
})

router.patch('/houses/:id', (req, res) => {
    try {
        var id = req.params.id;
        var updateHouse = {
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            size: req.body.size,
            type: req.body.type,
            zipCode: req.body.zipCode,
            rooms: req.body.rooms,
            bathrooms: req.body.bathrooms,
            parking: req.body.parking,
            price: req.body.price,
            code: req.body.code
        }
        houseSchema.findByIdAndUpdate(id, updateHouse).then((result) => {
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


// router.delete('/houses/:code', (req, res) => {
//     var code = req.params.code;
//     houseSchema.deleteOne({ code: code }).then(() => {
//         res.json({ "Status": "Success", "message": "La Casa fue eliminada" });
//     }).catch((error) => {
//         console.log(error);
//         res.json({ "Status": "Error", "message": "Error eliminando la casa solicitada" });
//     })
// })

router.delete('/houses/:id', (req, res) => {
    var id = req.params.id;
    houseSchema.deleteOne({ _id: id }).then(() => {
        res.json({ "Status": "Success", "message": "La Casa fue eliminada" });
    }).catch((error) => {
        console.log(error);
        res.json({ "Status": "Error", "message": "Error eliminando la casa solicitada" });
    })
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/houses/')
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

router.post('/upload/:id/house', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ 'status': 'Error', 'message': 'No se ha subido ningun archivo' });
    }
    var id = req.params.id;
    var updateHouse = {
        image: req.file.path
    }
    console.log(updateHouse);
    houseSchema.findByIdAndUpdate(id, updateHouse,{new : true}).then((result) => {
        res.send({ "status": "success", "message": "Archivo subido correctamente" });
    }).catch((error) => {
        console.log(error);
        res.send({ "status": "error", "message": "Error subiendo el archivo" });
    })

})



module.exports = router;
