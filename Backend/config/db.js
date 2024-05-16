import mongoose, { connect } from "mongoose";

export const connectdb=async ()=>{
  await mongoose.connect('mongodb+srv://rvatthanayake:2001rv1@tastet.wsyj4ep.mongodb.net/TasteTrail').then(()=>console.log("DB connected"));

}