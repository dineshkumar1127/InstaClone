const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')
const Mongoose = require('mongoose')
const bodyParser = require('body-parser')





Mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

Mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB")
})

Mongoose.connection.on('error',(err)=>{
    console.log("Error connecting Mongo",err)
})



require('./model/user')
require('./model/post')

app.use(bodyParser.json())
app.use(require('./routers/auth'))
app.use(require('./routers/post'))
app.use(require('./routers/user'))


if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'))
    // const path = require('path')
    // app.get("*",(req,res)=>{
    //      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
   //  })
}


app.listen(PORT,()=>{
    console.log("we are running using PORT",PORT)
})