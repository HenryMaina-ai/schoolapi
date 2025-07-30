// Entry file
const express = require("express")
const mongoose = require("mongoose")
const cors= require("cors")
require('dotenv').config()

// middleware
const app = express()
app.use(express.json())
app.use(cors())

// static files accessibility
app.use("/uploads",express.static)

// login/register routes
const userAuth = require('./routes/loginRoute')
app.use('/api/user/Auth',userAuth)

//classroom routes
const classrooms=require('./routes/classroomRoute')
app.use('/api/classroom',classrooms)


// connection to the database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected"))
.catch(err=>console.log("Mongo Connection error"))

const PORT = 3000
app.listen(PORT,()=>{
    console.log("Server running on port "+PORT+"...")
})