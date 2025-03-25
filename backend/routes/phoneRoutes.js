const router = require("express").Router();
const phone = require("../model/phoneModel");

router.route("/add").post((req, res)=>{

    const number = req.body.number;
    const newNumber = new phone({
        number,
    })

    newNumber.save().then(()=>{
        res.json("number added")
    }).catch((err)=>{
        console.log(err);
    })

});

module.exports = router;