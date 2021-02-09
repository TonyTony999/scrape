const Cars = require("../Models/Cars")
const CarModels = require("../Models/CarModels")

module.exports={
 
    async getModelPrice(req,res){
        let quer=req.params.car_id
        quer? quer={_id:quer}: quer={}
      let results= await Cars.find(quer)
      try {
          if(results.length>1){
              let carModels=await CarModels.find()
              for(let i=0;i<results.length;i++){
               
              }

          }
          else if(results.length===1){
            let marca=results.marca.toLowerCase()
            let modelo=results.modelo.toLowerCase()

          }

      } catch (error) {
          
      }
    }

}