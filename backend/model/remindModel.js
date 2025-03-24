const mongoose = require('mongoose');
const schema = mongoose.Schema;

const remindSchema = new schema({
    
    dateRemind:{
        type : Date,
        required : true
    },
    piority:{
        type: String,
        required: true
    },
    descrption:{
        type: String,
        required: true
     }
})

const remindAndNotification = mongoose.model("remindModel",remindSchema);
module.exports = remindAndNotification;