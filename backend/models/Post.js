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
PostSchema.index({ createdAt: -1 });
PostSchema.index({ uid: 1, createdAt: -1 });
const Postmodel= mongoose.model('Posts',PostSchema);
module.exports=Postmodel