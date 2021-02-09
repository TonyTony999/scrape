const axios = require("axios")
const express = require("express")
const mongoose = require("mongoose")
const cheerio = require("cheerio")

const Cars = require("./Models/Cars")
const carModels = require("./Models/CarModels")
const Years = require("./Models/Years")
const Prices = require("./Models/Prices")

require("dotenv").config()
const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })


module.exports={

async getShortResults(req,res){



async function getResults2() {

    let carModels1 = await carModels.find({})
    let definitiveCars=[]

    function getModelArray(marca1) {

        let modelMatches = []
        let sortedArr = []

        let marcaModels = carModels1.filter(element => {
            return element.marca === marca1
        })     
        if (modelMatches.length === 0) {
            marcaModels[0].modelos.forEach((element, index) => {
                let regex = /\w+/gi
                let regexMatch = element.match(regex)
                if (regexMatch && regexMatch.length !== 0) {
                    if (index > 0 && marcaModels[0].modelos[index - 1].match(regex)[0] !== regexMatch[0]) {
                        modelMatches.push(regexMatch[0])
                    }

                }
            })
            sortedArr = modelMatches.sort(function (a, b) {
                return b.length - a.length
            })
            return sortedArr

        }

    }

    async function addToArray(marca1, modelo1, ano1, ubicacion1,prix1,link) {
        let regex1=new RegExp(String.raw`${modelo1}`)
        let versionPrice = await Prices.find({ marca: marca1, modelo: { $regex: regex1, $options: "i" }, anos: ano1 })
        let newObj = Object.assign({},{marca:marca1,modelo:modelo1,ano:ano1,ubicacion:ubicacion1,precio:prix1,link:link})
        //console.log(versionPrice)
        if (versionPrice && versionPrice.length !== 0) {
            if (newObj && newObj._doc) {
                let price = []
                versionPrice.forEach(element => {
                    element.precio.forEach(element2 => {
                        element2.modelo = element.modelo
                        element2.ano = element.anos
                        // console.log(element2)
                        price.push(element2)
                    })
                })
                newObj._doc.precioComercial = price
                return newObj._doc
            }
            else {
                let price = []
                versionPrice.forEach(element => {
                    element.precio.forEach(element2 => {
                        element2.modelo = element.modelo
                        element2.ano = element.anos
                        // console.log(element2)
                        price.push(element2)
                    })
                })
                newObj.precioComercial = price
                return newObj
            }

        }

        return newObj._doc
        //return newObj
    }


    
    await axios.get("https://carros.tucarro.com.co/_PublishedToday_YES").then(res3 => {

      
        
        const $ = cheerio.load(res3.data)
        let numberCarros = $("main").find("div>div>div>aside>div").next().html()
        //console.log(numberCarros)
        let numCars = numberCarros.match(/\d+/)[0]
        // console.log(numCars[0])
        let num = 97
        let arr = [49, 97]
        while (num < numCars) {
            num += 48
            arr.push(num)
        }
        //console.log(arr)
        
        let list = $("main", ".results-item").find("div>div>div>section>ol").html()
        $("li").each((index, element) => {
            let title = $(element).find("div>a>div>h2").html()
            let yearKilometraje = $(element).find("div>a>div>div").next().html()
            let price = $(element).find("div>a>div>div>span").next().html()
            let ubicacion = $(element).find("div>a>div>div").next().next().next().html()
            let link=$(element).find("div").html()
            let marca;
            let modelo;
            let version;
            //console.log("link is",link)
            
            if (title && yearKilometraje && price && ubicacion) {

                let titleRegex = />(.*)</
                let titleMatch = title.match(titleRegex)
                if (titleMatch) {
                    title = titleMatch[1]
                }

                let year = yearKilometraje.match(/\d+/)
                let kilometraje = yearKilometraje.match(/\d+[" "]km/)
                link=link.match(/item-url=[\s\S]+\s$/i)[0].split(" ")
                if(link){
                    link=(link[0])
                    link=link.match(/https(.*)/i)[0]
                }
                    
                for (let i = 0; i < carModels1.length; i++) {

                    let regex = new RegExp(String.raw`${carModels1[i].marca}`, "i")
                    //console.log(title.toLowerCase(),regex)
                    let regexMatch = title.toLowerCase().match(regex)
                    if (regexMatch) {
                        marcaDef = regexMatch[0]
                        let brandModels=getModelArray(marcaDef)
                        //console.log(brandModels)
                       if (brandModels && brandModels.length !== 0) {
                            for (let j = 0; j < brandModels.length; j++) {
                                let modeloRegex = new RegExp(String.raw`${brandModels[j]}`, "i")
                                let modeloMatch2=title.match(modeloRegex)
                                if(modeloMatch2){
                                    
                                 async function myFunction(){
                                        return await addToArray(marcaDef,brandModels[j],year,ubicacion,price,link)
                                    }
                                 return definitiveCars.push(myFunction())
                                    
                               }

                            }

                        }

                    }

                }

            }

        })
       
       
    })
    let newRes=[]
   await Promise.allSettled(definitiveCars).then(results=>results.forEach(result=>newRes.push(result)))
    return newRes
    
}

getResults2().then(result=>{
   // console.log(result["2"].value.precioComercial)
   // console.log(Object.keys(result))
   
   result=result.map(element=>{
       element=element.value
       return element
   })
  res.send(result)
})

}

}