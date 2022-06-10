const bcrypt = require("bcryptjs/dist/bcrypt");
const async = require("hbs/lib/async");
const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    ph: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    course: {
        type: String
        
    },
image: {
    type: String,
    required: true
},
roll: {
    type: String,
    required: true
},
reg: {
    type: String,
    required: true
},
year:
{
    type:Number
},
marks: [ 
    {
        mr: Number
    }
]



});
schema.pre("save", async function(next){
    // const passworsHash=await bcrypt.hash(password,10);
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=await bcrypt.hash(this.password,10);
    }
    next();
})

const register=new mongoose.model("register",schema);

module.exports=register;