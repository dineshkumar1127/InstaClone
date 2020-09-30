const express = require('express')
const router = express.Router()
const Mongoose = require('mongoose')
const User = Mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport  = require('nodemailer-sendgrid-transport')
const {SENDGRID_API, EMAIL_URL} = require('../config/keys')


const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))


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
            transporter.sendMail({
                to:user.email,
                from:"dk9026563429@gmail.com",
                subject:"Signup Successfully",
                html:"<h1>Welcome to Instagram</h1>"
            })
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
    
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")

        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User with Email does not Exists"})
            }
            user.resetToken = token
            user.expireToken = Date.now()+3600000

            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"dk9026563429@gmail.com",
                    subject:"Password Reset",
                    html:`
                        <p>You are requested for Password Reset</p>
                            <h5>Click on this <a href="${EMAIL_URL}/reset/${token}">link</a> to reset the password</h5>`
                })
                res.json({message:"Check your Email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token

    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again Session Expired"})
        }

        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined

            user.save().then((savedUser)=>{
                res.json({message:"Password successfully changed"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
 })
module.exports=router