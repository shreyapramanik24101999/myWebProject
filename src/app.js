const express = require("express");
const multer =require("multer");
const path=require("path");
const hbs=require("hbs");
const app=express();
const {v4 : uuidv4} = require('uuid');
require("./db/conn");
const Register=require("./models/registration");

let reg="ru000";
let roll="2022000";
let count=0;

const { json } = require("express");
const { log }= require("console");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { use } = require("express/lib/router");
const async = require("hbs/lib/async");
// const async = require("hbs/lib/async");
// const async = require("hbs/lib/async");

app.use(express.json());

app.use(express.urlencoded({extended: false}));

const port=process.env.PORT || 8000;
const staticPath=path.join(__dirname,"../public");
const templatePath=path.join(__dirname,"../templates/views");
const partialsPath=path.join(__dirname,"../templates/partials");

app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",templatePath);
hbs.registerPartials(partialsPath);

const Storage=multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"./public/user_image");
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+path.extname(file.originalname));
    }
});
const upload=multer({
        storage: Storage
    }).single("img");

app.get("/",(req,res)=>{
    console.log("hi");
    res.render("index");
})
app.get("/register",(req,res)=>{
    console.log("hi");
    res.render("register");
})
app.get("/login",(req,res)=>{
    console.log("hi");
    res.render("login");
})

app.post("/register",upload, async (req,res) => {

    try{
        const password=req.body.password;
        const confirmPassword=req.body.confirmPassword;

        if(password === confirmPassword)
        {
            count++;
            let croll=`${roll}${count}`;
            let creg=`${reg}${count}`;
            const register=new Register(
                {
                    fname: req.body.ufirstName,
                    lname: req.body.ulastName,
                    email: req.body.uemail,
                    ph: req.body.uph,
                    gender: req.body.ugender,
                    address: req.body.uaddress,
                    password: req.body.upas,
                    dob: req.body.udob,
                    dept: req.body.dept,
                    course: req.body.course,
                    image: req.file.filename,
                    roll: croll,
                    reg: creg

                }
            )

           // const token=await registerUser.generateAuthToken();

            /*res.cookie("jwt",token,{
                expires: new Date(Date.now() + (1000*60*60*24*2)),
                httpOnly: true
            });*/

            const userRegistered=await register.save();
            res.status(201).render("login");
        }
        else{
            res.send(`Passwords are not matching....`);
        }

    }catch(e)
    {
        res.status(400).send(e);
    }
})



/*app.get("/vendor_home", (req,res) => {
    res.render("vendor_home");
})*/

app.post("/student_login", async (req,res) => {
    try{
        const email=req.body.uemail;
        const password=req.body.upassword;

        const userEmail = await Register.findOne({email : email});
console.log("hello");
        const isMatch=await bcrypt.compare(password,userEmail.password);
console.log(isMatch);
        // const token=await userEmail.generateAuthToken();

        // res.cookie("jwt",token,{
        //     expires: new Date(Date.now() + (1000*60*60*24*2)),
        //     httpOnly: true
        // });
        // console.log(userEmail.marks);
            const arr=userEmail.marks;
            const list=JSON.stringify(arr);
            const img=JSON.stringify(userEmail.image);
// console.log(list);
        if(isMatch)
        {
            res.status(201).render("profile",{
                fname: userEmail.fname,
                lname: userEmail.lname,
                roll: userEmail.roll,
                reg: userEmail.reg,
                ph: userEmail.ph,
                email: userEmail.email,
                dept: userEmail.dept,
                cr: userEmail.course,
                yr: userEmail.year,
                add: userEmail.address,
                dob: userEmail.dob,
                img: img,
                list: list
            });
        }
        else{
            res.send(`Password are not matching ${password}`);
        }
    }
    catch(e){
        res.status(400).send("Invalid login details");
    }
})

app.post("/admin_login", async (req,res) => {
    try{
        const email=req.body.vemail;
        const password=req.body.vpassword;

        const teacherEmail = await Register.findOne({email : email});

        console.log(`${teacherEmail.password}`);

        const isMatch=await bcrypt.compare(password,teacherEmail.password);

        //const arr=JSON.stringify(vendorEmail.order);

        //const token=await vendorEmail.generateAuthToken();

        // res.cookie("jwt",token,{
        //     expires: new Date(Date.now() + (1000*60*60*24*2)),
        //     httpOnly: true
        // });

        if(isMatch)
        {
            res.status(201).render(`admin`);
        }
        else{
            res.send(`Password are not matching`);
        }
    }
    catch(e){
        res.status(400).send("Invalid login details");
    }
})
        

app.listen(port, () => {
    console.log(`Server is running at port number ${port}`);
});
