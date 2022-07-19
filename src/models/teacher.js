const bcrypt = require("bcryptjs/dist/bcrypt");
const async = require("hbs/lib/async");
const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    dept: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
   
});
// schema.pre("save", async function(next){
//      const passworsHash=await bcrypt.hash(password,10);
//     if(this.isModified("password")){
//         this.password=await bcrypt.hash(this.password,10);
//     this.confirmPassword=await bcrypt.hash(this.password,10);
//     }
//     next();
// })

const teacher=new mongoose.model("teacher",schema);

module.exports=teacher;