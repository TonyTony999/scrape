const Cars = require("../Models/Cars")
const Prices = require("../Models/Prices")

module.exports={
    async checkIfExists(req,res){
        const {marca}=req.params
        const {modelo}=req.query
        const {ano}=req.query

        try {
            
            
            if(marca && modelo && ano){
                let car=await Prices.find({marca:marca,modelo:modelo,anos:ano})
                if (car.length!==0){
                    return res.send(car)
                }
            }
            else if(marca && modelo){
                let car=await Prices.find({marca:marca,modelo:modelo})
                if (car.length!==0){
                    return res.send(car)
                }
            }
            else if(marca && ano){
                let car=await Prices.find({marca:marca,anos:ano})
                if (car.length!==0){
                    return res.send(car)
                }
            }
            else if(marca){
                let car=await Prices.find({marca:marca})
                if (car.length!==0){
                    return res.send(car)
                }
               
            }
            else if(modelo){
                let car=await Prices.find({modelo:modelo})
                if (car.length!==0){
                    return res.send(car)
                }
            }

            
            
        } catch (error) {
            console.log(error)
            return res.status(404).message("car not found")
        }
        
        
        }
        
}


