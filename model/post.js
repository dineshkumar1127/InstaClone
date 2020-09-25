const Mongoose = require('mongoose')
const {ObjectId} = Mongoose.Schema.Types

const postSchema = new Mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    body:{
        type:String,
        required:true
    },

    photo:{
        type:String,
        required:true
    },

    likes:[{
        type:ObjectId,
         ref:"User"
        }],
     
    comments:[{
        text :String,
        postedBy:{type:ObjectId, ref:"User"}
    }],    

    postedBy:{
        type: ObjectId,
        ref: "User"
    }
})

Mongoose.model("Post",postSchema)