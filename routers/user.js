const express = require('express')
const router = express.Router()
const Mongoose = require('mongoose')
const Post = Mongoose.model("Post")
const requireMiddleware = require('../middleware/requiredLogin')
const User = Mongoose.model("User")

router.get('/user/:id',requireMiddleware,(req,res)=>{
    User.findOne({_id : req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy: req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})


router.put('/follow',requireMiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{follower:req.user._id}
    },{
        new: true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push: {following: req.body.followId}
        },{
            new: true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})








router.put('/unfollow',requireMiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{follower: req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following: req.body.unfollowId}
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})



router.put('/updatepic',requireMiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set: {pic: req.body.pic}},{
        new : true
    },(err,result)=>{
    if(err){
        return res.status(422).json({error:"pic not posted"})
    }
    res.json(result)
  })
})


module.exports = router