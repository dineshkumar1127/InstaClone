const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const Mongoose = require('mongoose')
const User = Mongoose.model("User")

module.exports = (req,res,next) =>{                 //functional export

    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({error:"you must loggedIn"})
    }

    const token = authorization.replace("jozem ","")

    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must loggedIn"})
        }

        const {_id} = payload
 
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })

    })

}


