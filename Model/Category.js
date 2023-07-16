const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title : {
      type : String,
      required : true
  },
  description : {
      type : String,
      required : true
  }, 
  fileUrl : {
      type : String,
      required : true
  },
  shows: [{
    title : {
        type : String,
        required : true,
    },
    content: {
      type: String,
      required: true
    },
    fileUrl : {
        type : String,
        required : true
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

module.exports= mongoose.model("Category",categorySchema);