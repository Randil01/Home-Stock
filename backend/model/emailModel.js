const mongoose = require('mongoose');
const schema = mongoose.Schema;

const numberSchema = new schema({
    
    email:{
        type : String,
        required : true,
        unique : true,
    }
    
});

const number = mongoose.model("emailModel",numberSchema);
module.exports = number;