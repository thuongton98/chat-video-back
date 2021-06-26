const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messSchema = new Schema({
   
    name: {
        type: String,
        required: true,
        },
    mess: {
        type: String,
        required: true,
        },
    room_id:[],

   

},{
    timestamps: true,
});

const Mess = mongoose.model('Mess', messSchema);

module.exports = Mess;