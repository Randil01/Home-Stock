const router = require("express").Router();
const remind = require("../model/remindModel");

router.route("/add").post((req, res)=>{

    const dateRemind = req.body.dateRemind;
    const piority = req.body.piority;
    const descrption = req.body.descrption;

    const newRemind = new remind({

        dateRemind,
        piority,
        descrption
    })

    newRemind.save().then(()=>{
        res.json("notifi added")
    }).catch((err)=>{
        console.log(err);
    })

});

//display all the data
router.route("/displayRemind").get((req,res)=>{
    remind.find().then((remind)=>{
        res.json(remind)
    }).catch((err)=>{
        console.log(err)
    })
});

//display one
router.route("/displayRemindOne/:id").get(async (req, res) => {
    try {
        const remindID = req.params.id;
        const remindData = await remind.findById(remindID); // Find remind by ID

        if (!remindData) {
            return res.status(404).json({ message: "Reminder not found" }); 
        }
        res.json(remindData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

//upadte record
router.route("/updateRemind/:id").put(async(req,res)=>{//can use post(put)
    let RemindId = req.params.id;//param mean parameter above id is id
    const {dateRemind,piority,descrption} = req.body;//getdetails

    const upadteRemind = {
        dateRemind,
        piority,
        descrption
    }
    const update = await remind.findByIdAndUpdate(RemindId,upadteRemind).then(()=>{//check vehi is avibale update object above
        //data pass to frontend
        res.status(200).send({status:"Remind updated"})//user:update showed update data

    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"Error;Remind Not updated",error:err.message})//send if not updated
    })

})

//Delete remind
router.route("/deleteRemind/:id").delete(async(req,res)=>{
    let remindId = req.params.id;

    await remind.findByIdAndDelete(remindId).then(()=>{
        res.status(200).send({status:"Remind deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"Error;Remind Not deletd",error:err.message})
    })

})

module.exports = router;