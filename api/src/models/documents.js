const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
   
    docName: {
      type: String,
    },
    Url: {
      type: String,
    },
 
     status:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('documents', documentSchema);
