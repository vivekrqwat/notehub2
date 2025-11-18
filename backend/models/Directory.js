const mongoose=require("mongoose")

const topicSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
   
    required: true
  }
});

const DirectorySchema= new mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    Dirname:{
        type:String,
        required:true,
        ref:"Directory"
    },
    desc:{
        type:String,
        maxlength: [100, "Description should not be more than 100 characters"]
    },
    topic:{
        type:[topicSchema],
        default:[]
    },
    grade:{
        type:String,
        default:"Green"
    }
      





},{timestamps:true})
const Directorymodel= mongoose.model('Directory',DirectorySchema);
module.exports=Directorymodel