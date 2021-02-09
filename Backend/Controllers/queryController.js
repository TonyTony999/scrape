//const { getAllCars } = require("./dashboardController");
//const scrape3Model=require("../Models/scrape3Models");
const scrape3Models = require("../Models/scrape3Models");
const carModels = require("../Models/CarModels");
const ubicacionesModel = require("../Models/Ubicaciones");
//const { all } = require("../routes");


module.exports = {

    async getCars(req, res) {
        try {
            const { marca } = req.params
            const { ano }= req.params
            const { ubicacion }= req.params
            if(marca==="default" && ano==="default" && ubicacion==="default"){
                let cars=await scrape3Models.find({})
                if(cars){
                    return res.send(cars)
                }              
            }
            else if(marca==="default" && ano==="default" && ubicacion!=="default" ){
                let cars=await scrape3Models.find({ubicacion:ubicacion})
                if(cars){
                    return res.send(cars)
                } 
            }
            else if(marca==="default" && ano!=="default" && ubicacion !=="default"){
                let cars=await scrape3Models.find({year:ano,ubicacion:ubicacion})
                if(cars){
                    return res.send(cars)
                } 
            }
            else if(marca!=="default" && ano!=="default" && ubicacion!=="default"){
                let cars=await scrape3Models.find({marca:marca,year:ano,ubicacion:ubicacion})
                if(cars){
                        return res.send(cars)
                }                         
            }
            else if(marca!=="default" && ano!=="default" && ubicacion==="default"){
                let cars=await scrape3Models.find({marca:marca,year:ano})
                if(cars){
                        return res.send(cars)
                }   
            }
            else if(marca!=="default" && ano==="default" && ubicacion==="default"){
                let cars=await scrape3Models.find({marca:marca})
                if(cars){
                        return res.send(cars)
                }   
            } 
            else if(marca!=="default" && ano==="default" && ubicacion!=="default"){
                let cars=await scrape3Models.find({marca:marca,ubicacion:ubicacion})
                if(cars){
                        return res.send(cars)
                }   
            }
            else if(marca==="default" && ano!=="default" && ubicacion==="default"){
                let cars=await scrape3Models.find({year:ano})
                if(cars){
                        return res.send(cars)
                }   
            }
              
            
            
        } catch (error) {
           return res.send(error)
        }
       
    },
    async getAllBrands(req,res){
        try {
            let allBrands=await carModels.find({})
            if (allBrands){
                return res.send(allBrands)
            }
        } catch (error) {
            return res.send(error)
        }

    },
    async getAllLocations(req,res){
      try {
          let allLocations=await ubicacionesModel.find({})
          if(allLocations){
              return res.send(allLocations)
          }

      } catch (err) {
          return res.send(err)
      }
    }

}