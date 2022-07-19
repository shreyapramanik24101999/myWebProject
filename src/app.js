const express = require("express");
const multer =require("multer");
const path=require("path");
const hbs=require("hbs");
const app=express();
const {v4 : uuidv4} = require('uuid');
require("./db/conn");
const Register=require("./models/registration");
const Teacher=require("./models/teacher");



let reg="ru000";
let roll="2022000";
// var count=8;

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
    
    res.render("index");
})
app.get("/register",(req,res)=>{
   
    res.render("register");
})
app.get("/login",(req,res)=>{
   
    res.render("login");
})

app.post("/register",upload, async (req,res) => {

    try{
        const password=req.body.password;
        const confirmPassword=req.body.confirmPassword;

        if(password === confirmPassword)
        {
            // count++;
            // console.log(count);

            const no_stu=await Register.find();
            let count=no_stu.length+1;
            console.log(count);
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
                    reg: creg,
                    year: 1
                }
            )

           // const token=await registerUser.generateAuthToken();

            /*res.cookie("jwt",token,{
                expires: new Date(Date.now() + (1000*60*60*24*2)),
                httpOnly: true
            });*/

            const userRegistered=await register.save();

            await Register.update({email : req.body.uemail},{
                $push:  {"marks" :{
                    mr: 1
                }}
            })

            res.status(201).redirect("/login");
        }
        else{
            res.send(`Passwords are not matching....`);
        }

    }catch(e)
    {
        res.status(400).send(e);
    }
})





app.post("/student_login", async (req,res) => {
    try{

        const email=req.body.uemail;
        const password=req.body.upassword;

        const userEmail = await Register.findOne({email : email});

        const isMatch=await bcrypt.compare(password,userEmail.password);
        
            const arr=userEmail.marks;
            const list=JSON.stringify(arr);
            const img=JSON.stringify(userEmail.image);

console.log(userEmail);
console.log("_____________________________________________________________________");
console.log(list);
console.log("_____________________________________________________________________");
console.log(img);


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
                // cr: userEmail.course,
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

        const dept=req.body.dept;
        const course=req.body.course;
        const year=req.body.year;
        const password=req.body.apassword;

        

        const department = await Teacher.findOne({dept : dept});
        

        let arr="";
        if("B.Tech".localeCompare(`${dept}`)==0||"M.Tech".localeCompare(`${dept}`)==0)
        {
            const list=await Register.find({ $and:[{course : course},{year : year},{dept : dept}]});
           
      
            arr=JSON.stringify(list);
        }
        else{
            const list=await Register.find({ $and:[{dept : dept},{year : year}]});

      
            arr=JSON.stringify(list);
        }

        if(password===department.password)
        {
            res.status(201).render(`admin`,{
                department: dept,
                year: year,
                course: course,
                list: arr 
            });
        }
        else{
            res.send(`Password are not matching`);
        }
    }
    catch(e){
        res.status(400).send(e.message);
    }
})

app.post("/update",async (req,res)=>
{
    try{
        
        const email= req.body.email;
        const year= req.body.year;
        const dept=req.body.dept;
        const course=req.body.course;




        const num= req.body.marks;
        if(num>=40)
        {
            let upyr=parseInt(year)+1;
            const updateyr= await Register.findOneAndUpdate({email},{year : upyr});
          
            const stu=await Register.findOne({email:email});


        
        

            const id=(stu.marks)[year-1]._id;
            let s_id=id.toString();

            const updatemr=await Register.updateOne({"marks._id": s_id},
            {
                $set: {
                    "marks.$.mr": num
                }
            }

            )
            await Register.updateOne({email : email},{
                $push:  {"marks" :{
                    mr: 1
                }}
            })

           

        }

        else
        {
            const stu=await Register.findOne({email:email});
             

            const id=(stu.marks)[year-1]._id;
            let s_id=id.toString();

            // console.log(id.toString());
            // console.log(num);
            
            const updatemr=await Register.updateOne({"marks._id": s_id},
            {
                $set: {
                    "marks.$.mr": num
                }
            }

            )
        }


        const department = await Teacher.findOne({dept : dept});
        

        let arr="";
        if("B.Tech".localeCompare(`${dept}`)==0||"M.Tech".localeCompare(`${dept}`)==0)
        {
            const list=await Register.find({ $and:[{course : course},{year : year},{dept : dept}]});
           
       
            arr=JSON.stringify(list);
        }
        else{
            const list=await Register.find({ $and:[{dept : dept},{year : year}]});

      

            arr=JSON.stringify(list);
        }

        res.status(201).render(`admin`,{
            department: dept,
            year: year,
            course: course,
            list: arr 
        });

    }
    catch(e)
    {
        res.send(e.message);

    }
   
}
)        

app.listen(port, () => {
    console.log(`Server is running at port number ${port}`);
});

