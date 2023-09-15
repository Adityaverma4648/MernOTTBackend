const mongoose = require('mongoose');

const watchLaterSchema = new mongoose.Schema({
    id : {
          type : Number,
          unique : true,
          required : true
    },
    title : {
        type : String,
        required : true
        
    },
    overview : {
         type : String,
         required : true
    },
    release_date : {
        type : Date,
    },
    image : {
      type : String,
      required : true
    }
},
{
     timestamps: true,
}
)

module.exports= mongoose.model("watchLater",watchLaterSchema);