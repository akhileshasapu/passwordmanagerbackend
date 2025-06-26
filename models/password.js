import mongoose, { model } from "mongoose"

const  passwordschema = new mongoose.Schema({
site:{type:String,required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
username:{type:String,required:true},
password:{type:String,required:true}

})
const Password= mongoose.model("password",passwordschema)
export default Password