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
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

},
{
     timestamps: true,
}
)

module.exports= mongoose.model("Short",shortSchema);