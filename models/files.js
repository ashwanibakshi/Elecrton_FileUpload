const mongoose  = require("mongoose");

const fileSchema = new mongoose.Schema({
     name:{
      type:String 
     },
     filee:{
         type:String
     }
});

module.exports = mongoose.model('upfiles',fileSchema);