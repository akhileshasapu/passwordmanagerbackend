import mongoose, { model } from "mongoose"

const  userschema = new mongoose.Schema({
username:{type:String,required:true},
email:{type:String,required:true,unique:true},
passwordHash:{type:String,required:true}

})
const user= mongoose.model("user",userschema)
export default user