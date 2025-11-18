const mongoose=require("mongoose")

const PostSchema= new mongoose.Schema({
   
        username:{
            type:String,
           required:[true,"username not ,found invalid user"]
        },
        email:{
            type:String,
            default:"",
            
        },
        title:{
            type:String,
            default:""
            
        },
        desc:{
            type:String,
            default:""
            
        },
        img:{
            type:String,
            default:""
        },
        likes:{
            type:Array,
            default:[]
        },
         comments:{
            type:Array,
            default:[]
        },
         uid:{
         type:String
            },






},{timestamps:true})
const Postmodel= mongoose.model('Posts',PostSchema);
module.exports=Postmodel