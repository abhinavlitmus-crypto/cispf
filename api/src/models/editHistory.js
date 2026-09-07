const mongoose = require('mongoose');

const editHistorySchema = new mongoose.Schema({

  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'admins'
  },
  oldData: {
    type: Object,
  },
   docId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  newData: {
    type: Object,
  },
  operation: {
   type:String,
  },
  
  tableName:{
    type: String,
  },
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true,
});

module.exports = mongoose.model('historyDetails', editHistorySchema);
