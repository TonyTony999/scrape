const Cars = require("../Models/Cars")
const Prices = require("../Models/Prices")
const carModels = require("../Models/CarModels")

module.exports = {

    async getAllCars(req, res) {
        try {
            const { marca } = req.params
            let query;
            marca ? query = { marca: req.params.marca } : query = {}
            let cars = await Cars.find(query)
            let carModelResults = await carModels.find({})
            if (cars.length !== 0 && carModelResults.length!==0 ) {
                //return res.send(cars)
                let updatedList = []
                async function getPrices() {

                    async function addToArray(marca1,regex1,currentE){
                        let versionPrice = await Prices.find({marca:marca1, modelo:{$regex:regex1, $options:"i"}, anos:currentE.ano })
                        let newObj = Object.assign({}, currentE)
                        if (versionPrice && versionPrice.length !== 0) {
                            let price= []
                             versionPrice.forEach(element=>{
                              element.precio.forEach(element2=>{
                                  price.push(element2)
                              })
                            })
                            newObj._doc.precioComercial = price    // versionPrice[0].precio
                           return newObj._doc

                        }
                        else{
                            return newObj._doc
                        }
                    }
                
                    for (let i = 0; i < cars.length; i++) {
                        if (cars[i].marca.toLowerCase() === "mazda") {

                            let bt50 = /bt50/i
                            let  bt50_match = cars[i].modelo.match(bt50)

                            let cx5=/cx[-"  *"]?5/gi
                            let  cx5_match = cars[i].modelo.match(cx5)

                            let mazd3 = /mazda[" *"-]?3/i
                            let  mazd3_match = cars[i].modelo.match(mazd3)

                            let mazd2 = /mazda[" *"-]?2/i
                            let  mazd2_match = cars[i].modelo.match(mazd2)
                            

                            if ( mazd3_match && mazd3_match.length !== 0) {
                              
                                addToArray("mazda",/^3-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue
                            }
                            else if ( mazd2_match && mazd2_match.length !== 0) {
                              
                                addToArray("mazda",/^2-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue
                            }
                            else if ( cx5_match && cx5_match.length !== 0) {
                              
                                addToArray("mazda",/^cx5-?[\w+?]/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    //console.log(result)
                                })
                                continue
                            }
                            else if ( bt50_match && bt50_match.length !== 0) {
                              
                                addToArray("mazda",/^bt50-?[\w+?]/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    //console.log(result)
                                })
                                continue
                            }

                            else{
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }

                        }
                        else if (cars[i].marca.toLowerCase() === "volkswagen"){
                            let jetta = /jetta/i
                            let match = cars[i].modelo.match(jetta)
                            if ( match && match.length !== 0) {
                              
                                addToArray("volkswagen",/^jetta-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                               
                                })
                                continue
                            }
                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }
                        else if (cars[i].marca.toLowerCase() === "suzuki"){
                            let vitara = /vitara/i
                            let match = cars[i].modelo.match(vitara)
                            if ( match && match.length !== 0) {
                              
                                addToArray("suzuki",/^vitara-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                               
                                })
                                continue
                            }
                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }

                        else if (cars[i].marca.toLowerCase() === "ford"){
                            let fiesta = /fiesta/i
                            let match = cars[i].modelo.match(fiesta)
                            if ( match && match.length !== 0) {
                              
                                addToArray("ford",/^fiesta-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                               
                                })
                                continue
                            }
                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }

                        else if (cars[i].marca.toLowerCase() === "kia"){
                            
                            let sportage= /Sportage/i
                            let sportageMatch = cars[i].modelo.match(sportage)

                            let picanto = /picanto/i
                            let match = cars[i].modelo.match(picanto)

                            let rio = /rio/i
                            let rioMatch = cars[i].modelo.match(rio)
                           


                            if ( match && match.length !== 0) {
                              
                                addToArray("kia",/^picanto-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            else if ( sportageMatch && sportageMatch.length !== 0) {
                              
                                addToArray("kia",/^sportage-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            else if ( rioMatch && rioMatch.length !== 0) {
                              
                                addToArray("kia",/^rio-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }
                        else if (cars[i].marca.toLowerCase() === "renault"){
                            let logan = /logan/i
                            let duster= /duster/i

                            let match = cars[i].modelo.match(logan)
                            let dusterMatch = cars[i].modelo.match(duster)

                            if ( match && match.length !== 0) {
                              
                                addToArray("renault",/^logan-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            if ( dusterMatch && dusterMatch.length !== 0) {
                              
                                addToArray("renault",/^duster-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }
                        else if (cars[i].marca.toLowerCase() === "toyota"){
                            let prado = /prado/i
                            let match = cars[i].modelo.match(prado)

                            let hilux = /hilux/i
                            let hiluxmatch = cars[i].modelo.match(hilux)

                            let corolla = /corolla/i
                            let corollamatch = cars[i].modelo.match(corolla)

                            if ( match && match.length !== 0) {
                              
                                addToArray("toyota",/^prado-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            else if ( hiluxmatch && hiluxmatch.length !== 0) {
                              
                                addToArray("toyota",/^hilux-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }
                            else if ( corollamatch && corollamatch.length !== 0) {
                              
                                addToArray("toyota",/^corolla-?\d?/,cars[i]).then(result=>{
                                    updatedList.push(result)
                                    
                                })
                                continue

                            }

                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }
                        else if (cars[i].marca.toLowerCase() === "nissan"){
                            let nissanCars= carModelResults.filter(element=>{
                                return element.marca==="nissan"
                            })

                            //console.log("nissan cars are",nissanCars[0].modelos )
                          
                            for(let j=0;j<nissanCars[0].modelos.length;j++){

                              
                                const re= new RegExp(String.raw`${cars[i].modelo.toLowerCase()}`)
                                let matches=nissanCars[0].modelos[j].match(re)
                                if(matches && matches.length!==0){
                                    console.log(matches)
                                    const re2= new RegExp(String.raw`${cars[i].modelo.toLowerCase()}[-" *"]?[\w+]*`)
                                    addToArray("nissan",re2,cars[i]).then(result=>{
                                        updatedList.push(result)
                                        
                                    })
                                    break
                                }
                                continue
                                  /*
                                else {
                                    let newObj = Object.assign({}, cars[i])
                                    updatedList.push(newObj._doc)
                                }*/
                            }
                            
                            
                            
                        }


                        else if (cars[i].marca.toLowerCase() === "mercedesbenz" || cars[i].marca.toLowerCase() === "mercedes-benz" ||
                        cars[i].marca.toLowerCase() === "mercedes benz" || cars[i].marca.toLowerCase() === "mercedes"){
                            
                            let claseA=/(?:^A|^clase[-" *"]?A)[-" *"]?[\w+]*[-" *"]?[\w+]*/i
                           let claseC=/(?:^C|^clase[-" *"]?C)[-" *"]?[\w+]*[-" *"]?[\w+]*/i

                            
                            let claseA_match = cars[i].modelo.match(claseA)      
                            let claseC_match = cars[i].modelo.match(claseC)

                            if ( claseA_match && claseA_match.length !== 0 ) {
                              let version=/A?-?[\d+]+/gi
                                let versionMatch=cars[i].version.match(version)
                                if(versionMatch && versionMatch.length!==0){
                                    version=versionMatch[0].match(/\d+/gi)

                                    const re= new RegExp(String.raw`^a-${version[0]}`)

                                    addToArray("mercedes-benz",re,cars[i]).then(result=>{
                                        updatedList.push(result)
                                        
                                    })
                                    continue
                                }
                                else{
                                    let newObj = Object.assign({}, cars[i])
                                     updatedList.push(newObj._doc)      
                                    // continue 
                                }
                                
                            }

                           else  if ( claseC_match && claseC_match.length !== 0 ) {
                            
                                let version=/C?-?[\d+]+/gi
                                  let versionMatch=cars[i].version.match(version)
                                  
                                  if(versionMatch && versionMatch.length!==0){
                                      version=versionMatch[0].match(/\d+/gi)
                                      //console.log(version[0])
                                    
                                      const re= new RegExp(String.raw`^c-${version[0]}`)

                                          addToArray("mercedes-benz",re,cars[i]).then(result=>{
                                             // console.log(result)
                                            updatedList.push(result)
                                      })
                                      continue
                                  }
                                  else{
                                      let newObj = Object.assign({}, cars[i])
                                       updatedList.push(newObj._doc)      
                                       continue 
                                  }
                                  
                              }

                            else {
                                let newObj = Object.assign({}, cars[i])
                                updatedList.push(newObj._doc)
                            }
                        }
                        

                ///////////////////////////////////////////////////////////////////////

                        else {
                            let versionPrice = await Prices.find({ modelo: cars[i].modelo.toLowerCase(), anos: cars[i].ano })
                            let newObj = Object.assign({}, cars[i])

                            if (versionPrice.length !== 0) {
                                newObj._doc.precioComercial = versionPrice[0].precio
                                updatedList.push(newObj._doc)

                            }
                            else {
                                updatedList.push(newObj._doc)
                            }
                        }

                    }
                    return updatedList
                }
                getPrices().then(response => {
                    //console.log(response)
                    return res.send(response)
                })

            }

            else {
                return res.json({ message: `no cars with marca: ${query}found` })
            }

        } catch (error) {
            return res.status(404)
        }


    },
    async getCarById(req, res) {
        const { car_id } = req.params
        let car = await Cars.findById({ _id: car_id })
        // console.log(car)
        try {
            if (car) {
                return res.send(car)
            }
        } catch (error) {
            return res.status(401).json(`car with id: ${car_id} was not found`)
        }
    }




}