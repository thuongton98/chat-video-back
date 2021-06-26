const router = require('express').Router();
// lay du lieu
let Room = require('../models/room-model');
//truen ra 
router.route('/').get((req, res)=>{
    Room.find()
        .then(room => res.json(room))
        .catch(err => res.status(400).json('Error: ' +err));
});


module.exports = router;