const User = require("../models/userModels");
const { hasing, createJWT ,comparePassword} = require("../utils");
const {sendNotififcation} = require('../utils/sendVerification')
const bcrypt = require('bcrypt');
const { sendPasswordchangeEmail } = require("../utils/passwordChange");
const {sendPasswordReset} = require('../utils/passwordResetRequest');
const jwt = require("jsonwebtoken");
const Smg = require("../models/messageModel");

const register = async(req,res) =>{
    const {firstname,lastname,email,password,DOB,gender} = req.body;
    if(!firstname || !lastname || !email || !password){
        return res.status(201).json({message:"Provide all Fields"});
    }
    try{
        const ExistUser = await User.findOne({email});
        if(ExistUser){
            return res.status(201).json({message:"Email Already Exist"});
        }
        
        const hasedPassword = await hasing(password);
        const user = await User.create({
            firstname,
            lastname,
            email:email.toLowerCase(),
            DOB,
            gender,
            password:hasedPassword,
        })
        sendNotififcation(user,res)
        user.save();
    }
    catch(err){
        res.status(201).json({message:err.message});
    }
}


const login = async(req,res) => {     
    const {email,password} = req.body;
    try{
        if(!email || !password){
            return res.status(201).json({message:"Enter Email And Password"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(201).json({message:"User Not Exist"})
        }
        const validPass = bcrypt.compare(password, user.password)
        
        if(!validPass){
            return res.status(201).json({message:"Incorrect Password"})
        }
        if(user.verified === true){
            const token = createJWT(user._id)
            res.cookie('token', token, { 
                path: "/",
                maxAge: 90000,
                sameSite: 'None',
                secure: true,
                Domain:"osm-beta.vercel.app"
            });
            return res.status(200).json({ data:token});
        }
        else{
            res.status(201).json({message:"Please Verify The Email"});
        }
    }
    catch(error){
        return res.status(201).json({message:error});
    }
}

const resetPasswordRequest = async(req,res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(201).json({message:"Email Not Found"})
        }
        sendPasswordReset(user,res);
    }
    catch(error){
        res.status(201).json({message:"User Not Found"})
    }
}

const passwordChange = async (req,res) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(201).json({message:'User Not Login'});
    }
    const payload = jwt.decode(token);
    const {password,newPassword} = req.body;
    const user = await User.findOne({_id:payload.userId});
    if(!user){
        return res.status(201).json({message:"This Email Not Found"})
    }
    const result = await comparePassword(password,user.password);
   
    if(result){
        const hasedPassword = await hasing(newPassword);
        const newuser = await User.findOneAndUpdate({_id:payload.userId},{password:hasedPassword})
        sendPasswordchangeEmail(newuser,res);
        console.log("Password Change Sucess");
    }
    else{
        res.status(201).json({message:"Incorrect Previos Password"})
    }
}

const verifiedpasswordChange = async(req,res) => {
    try{
        const hasedPassword = await hasing(req.body.newPassword);
        const newuser = await User.findOneAndUpdate({_id:req.body.userId},{password:hasedPassword})
        sendPasswordchangeEmail(newuser,res);
    }
    catch(error){
        res.status(201).json({message:"fail"});
    }
}

const logout = (req,res)=>{
    const token = "";
    res.status(200).cookie("token",token,{httpOnly:true,expaisIn:"1D", path: "/"}).json({message:"logout"});
}

const getMessage = async (req, res) => {
    try {
        const { data } = req.body;
        const smg = await Smg.find({ sender: data.sender, receiver: data.receiver });
        const smg2 = await Smg.find({ sender: data.receiver, receiver: data.sender });
        let messages = smg.concat(smg2);
        messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        res.status(200).json({ data:messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {getMessage,register,login,logout,resetPasswordRequest,passwordChange,verifiedpasswordChange}

