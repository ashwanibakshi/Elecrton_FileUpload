const mongoose  = require("mongoose");

const fileSchema = new mongoose.Schema({
     filee:{
         type:String
     }
});

module.exports = mongoose.model('upfiles',fileSchema);