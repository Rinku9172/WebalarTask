const mongoose = require('mongoose');
const { Schema } = mongoose;

const BoardSchema = new Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
   }, 
   boardName: {
      type: String,
      required: true
   },
   task: [{
      title: {
         type: String,
         required: true
      },
      due: {
         type: String,
         required: true
      },
      priority: {
         type: String,
         required: true
      }
   }]

});
module.exports = mongoose.model('boards', BoardSchema);