const router = require("express").Router();
const mail = require("../model/phoneModel");

router.route("/add").post((req, res)=>{

    const email = req.body.email;
    const newNumber = new mail({
        email,
    })

    newNumber.save().then(()=>{
        res.json("number added")
    }).catch((err)=>{
        console.log(err);
    })

});

module.exports = router;