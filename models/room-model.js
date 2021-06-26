const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
   

    room_id:[]

},{
    timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;