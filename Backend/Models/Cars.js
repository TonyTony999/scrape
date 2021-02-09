const mongoose=require("mongoose")


const Schema=mongoose.Schema

const carSchema= new Schema({
    html:String,
    img:String,
    link:String,
    marca:String,
    modelo:String,
    version:String,
    ano:String,
    kilometraje:String,
    cilindrada:String,
    precio:String,
    ubicacion:String,
    fotos:Array

})

const Cars=mongoose.model("Cars",carSchema)

module.exports=Cars