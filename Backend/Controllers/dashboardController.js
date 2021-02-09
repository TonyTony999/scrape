const Cars = require("../Models/Cars")
const Prices = require("../Models/Prices")
const carModels = require("../Models/CarModels")

const scrape3Models = require("../Models/scrape3Models")
const scrape3Cars = require("../Models/scrape3Cars")
const carArrayModel = require("../Models/CarArray")
const JWT = require("jsonwebtoken")
const axios = require("axios")
const Users = require("../Models/Users")


module.exports = {

    async getAllCars(req, res) {
        try {
            let cars = await scrape3Models.find({})

            res.send(cars)
        } catch (err) {
            res.send(err)
        }

    },

    async getCarArray(req, res) {
        JWT.verify(req.token, "secretkey", async (err, authData) => {
            if (err) {
                res.sendStatus(404)
            }
            try {
                const { startSlice } = req.params
                const { endSlice } = req.params

                let segment = await carArrayModel.find({ nombre: "nuevo" }, {
                    "car_lista": { $slice: [parseInt(startSlice), parseInt(endSlice)] }
                })
                if (segment && segment.length !== 0) {
                    //console.log(segment)
                    return res.send(segment)

                }
            } catch (error) {

            }

        })

    },

    async getCarById(req, res) {
        const { car_id } = req.params
        let car = await scrape3Models.findById({ _id: car_id })
        // console.log(car)
        try {
            if (car) {
                return res.send(car)
            }
        } catch (error) {
            return res.status(401).json(`car with id: ${car_id} was not found`)
        }
    }
  
,
async updateFavourites(req,res) {
    let { favoritos } = req.body
    let { id } = req.body
    if (favoritos && favoritos.length !== 0) {
        
        let added =await Users.updateOne({_id:id},{$set:{myFavourites:favoritos }})
    }
    else{
        console.log("no hay favoritos")
    }
},

async deleteFavourites(req,res) {
    let { user_id } = req.body
    let item = await Users.updateOne(
        {_id:user_id},
        { $set:{myFavourites:{}}}
        )
    res.send(item)
},
///////////////FINALLY FKING WORKING 

async getFavourites(req, res) { 
    try {
        let {favoritos}=req.headers
        favoritos=JSON.parse(favoritos)
        let carsArr=[]
            for(let i=0;i<favoritos.length;i++){             
                if(typeof favoritos[i]==="string"){
                    let car= await scrape3Models.find({_id:favoritos[i]})
                    if(car){
                        carsArr.push(car)
                    }
                }               
            }
            res.send(carsArr)
         

    } catch (err) {
        res.send(err)
    }

}

}