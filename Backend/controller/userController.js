import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


//login user
const loginUser = async (req,res) =>{
    const {email,password} = req.body;

    try {
        const user =await userModel.findOne({email})

        if (!user) {
            return res.json({success:false,message:"User Doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success:false,massage:"Invalid credentials"})
        }

        const token = createtoken(user._id);
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,massage:"Error"})
    }
}

const createtoken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser =async (req,res) => {
    const {name,password,email}=req.body;
    try{
        // checking is user already exists
        const exists= await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,massage:"User already exists"})
        }
        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false,massage:"please enter a valide email "})
        }

        if (password.length < 8) {
            return res.json({success:false,massage:"Please enter a strong password"})
        }

        //hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

       const user = await newUser.save()
        const token =createtoken(user._id)
        res.json({success:true,token})

    }catch (error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

const getUserDetails = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Error fetching user details' });
    }
};

export {loginUser,registerUser,getUserDetails}