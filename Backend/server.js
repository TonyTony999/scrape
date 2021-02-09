const mongoose=require("mongoose")
const express= require("express")
const app=express()
const routes=require("./routes")
const cors=require("cors")
const path =require("path")
//const timeout = require('connect-timeout'); //express v4

require("dotenv").config()

const HOST=process.env.HOST
const PORT=process.env.PORT
const MONGO_URL=process.env.MONGO_URL


mongoose.connect(MONGO_URL, {useNewUrlParser:true,useUnifiedTopology:true })

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'client/build')));

//app.use(express.static(path.join(__dirname ,'/public')))

app.use(routes)

app.listen(PORT, ()=>{

    console.log(`listening to port:${PORT}`)
})
