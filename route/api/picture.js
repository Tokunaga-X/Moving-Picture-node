const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Get All Pictures
router.get('/all',(req, res) => {
    let files=fs.readdirSync(path.join(__dirname,'../../public/upload/'));
    res.send(files);
});

// Get Single Pic
router.get('/one/:name', (req, res) => {
    // todo: if not jpg? png?
    fs.access(path.join(__dirname,'../../public/upload/',`${req.params.name}`),(err) => {
        if(!err){
            res.sendFile(path.join(__dirname,'../../public/upload/',`${req.params.name}`));
        }
        else {
            res.status(400).json({msg: `Weird, we can't find what u want!`});
        }
    })
});




module.exports = router;