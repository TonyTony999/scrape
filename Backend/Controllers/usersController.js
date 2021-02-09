const Users=require("../Models/Users")
//const axios = require("axios")
const express = require("express")
const bcrypt=require("bcrypt")
const JWT=require("jsonwebtoken")


module.exports={
 async registerUser(req,res){
   const {firstName,lastName,email,password}=req.body
   try {
    let data=await Users.find({email:email})
    let hashedPass=await bcrypt.hash(password,10)
    if(data.length===0){
     
       let user=await Users.create({
           firstName:firstName,
           lastName:lastName,
           email:email,
           password:hashedPass
       })
      return res.send(user)

       
    }
   } catch (error) {
      return res.status(404)
   }
  
 }
,
 async loginUser(req,res){
  const {email,password}=req.body
  try {
   let user=await Users.findOne({email:email})
   if(user && await bcrypt.compare(password, user.password)){
     let defUser={
       email:user.email,
       id:user._id

     }
   return JWT.sign({user:defUser},"secretkey", (err,token)=>{
     return res.json({
       token:token,
       id:user._id
     })
   } )

   }
   else{
     return res.send(`email ${email} not found register instead?`)
   }

  } catch (error) {
     return res.status(404)
  }
}

,
async getUser(req,res){
  try {
    const{user_id}=req.headers
    let user=await Users.find({_id:user_id})
    if (user){
      res.send(user)
    }
    
  } catch (error) {
    res.status(404).json({
      message:`user not found ${error}`
    })
  }
}



}
