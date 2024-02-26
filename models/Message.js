const mongoose = require('mongoose');
const userSchema = require('./User');

const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    readed: {
        type: Boolean,
        required: true,
        default: false
    }
},
    {       
         timestamps: true
    }
);

module.exports = mongoose.model('Message', messageSchema);
