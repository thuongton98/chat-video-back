const router = require('express').Router();
// lay du lieu
let Mess = require('../models/mess-model');
//truen ra 
router.route('/').get((req, res)=>{
    Mess.find()
        .then(mess => res.json(mess))
        .catch(err => res.status(400).json('Error: ' +err));
});


module.exports = router;