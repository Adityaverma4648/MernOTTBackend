const mongoose = require('mongoose');

const shortSchema = new mongoose.Schema({
  title : {
      type : String,
      required : true
  },
  caption : {
      type : String,
      required : true
  }, 
  fileUrl : {
      type : String,
      required : true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy : {
     type : String,
  }
},
{
     timestamps: true,
}
)

module.exports= mongoose.model("Short",shortSchema);