const Mongoose = require('mongoose')
const {ObjectId} = Mongoose.Schema.Types

const UserSchema = new Mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    resetToken:String,

    expireToken:Date,

    
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dcirgll8n/image/upload/v1600709437/74-741993_customer-icon-png-customer-icon-transparent-png_akwcmu.jpg"
    },

    follower:[{
        type:ObjectId,
        ref:"Post"
    }],

    following:[{
        type:ObjectId,
        ref:"Post"
    }]

})


Mongoose.model("User",UserSchema)