const express = require('express')
const router = express.Router()
const Mongoose = require('mongoose')
const User = Mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')





router.post('/signup',(req,res)=>{
   const {name,email,password,pic} = req.body

    if(!name || !email || !password){
        return res.status(421).json({error:"please add all the field"})
    }

    User.findOne({email:email})
    .then(savedUser=>{
     
        if(savedUser){
            return res.status(422).json({error:"User already exists"})
        }

        bcrypt.hash(password,12)
        .then(hashedpassword=>{

        const user = new User({
            name,
            email,
            password:hashedpassword,
            pic
        })

        user.save()
        .then(user=>{
            res.json({message:"successfully Registerd"})
        })

        .catch(err=>{
            console.log(err)
        })

    })

    .catch(err=>{
        console.log(err)
    })

})


    
})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body

    if(!email || !password){
        return res.status(422).json({error:"please add all the field"})
    }
    
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email Id"})
        }

        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               
                const tok = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,follower,following,pic} = savedUser;
                res.json({token:tok, user:{_id,name,email,follower,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid email Id"})
            }
        })

        .catch(err=>{
            console.log(err)  
        })
    })
    })
    




module.exports=router