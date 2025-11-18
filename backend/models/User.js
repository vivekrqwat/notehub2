const mongoose=require("mongoose")

const UserSchema= new mongoose.Schema({
        username:{
            type:String,
            required:[true,"please enter username"]
        },
         email:{
            type:String,
            required:[true,"please enter username"],
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        Profilepic:{
            type:String,
            default:""
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        follower:[],
        following:[],
        submission:[String]





})
const Usermodel= mongoose.model('Users',UserSchema);
module.exports=Usermodel