const mongoose=require("mongoose")
const contenschema= new mongoose.Schema({
    heading:{type:String,default:""},
    desc:{type:String,default:""},
    img:{type:String,default:""},
    grade: { type: String, default: "" },
      code:{
         type:String,
        default:""
    },
    
    Approach:{
        type:String,
        default:""

    }
})

const noteSchema= new mongoose.Schema({
    dirid:{
          type:String,
        required:true
    },
    desc:{
        type:String,
        default:""
    },
    heading:{
        type:String,
        default:""
    },
    content:{
        type:[contenschema]
    }
    ,
  
    img:{
        type:String,
        default:""
    },
  
    grade: { type: String, default: "" }
      





},{timestamps:true})
const Notesmodel= new mongoose.model('Notes',noteSchema);
module.exports=Notesmodel