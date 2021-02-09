const express=require("express")
const routes=express.Router()
const scrape=require("./scrape")
//const scrape_3=require("./scrape3")
const usersController= require("./Controllers/usersController")
const dashboardController = require("./Controllers/dashboardController")
const testController = require("./Controllers/testController")
const scrape3Models = require("./Models/scrape3Models")
const queryController = require("./Controllers/queryController")
const verifyToken=require("./Middleware/VerifyToken")

//Scrape Controllers



routes.get("/cars",scrape.getResults)
routes.get("/prices", scrape.getPrices)
routes.get("/delete-car-models", scrape.deleteCarModels)
routes.get("/delete-all-cars", scrape.deleteAllCars)
routes.get("/years",scrape.getYears )
routes.get("/delete-years",scrape.deleteAllYears)
routes.get("/final-prices",scrape.getFinalPrices)
routes.get("/delete-prices",scrape.deletePrices)

//routes.get("/get-simple", scrape_3.getDefResults)
//routes.get("/allCars", scrape_3.allCars)
//routes.get("/delete-scrape-3",scrape_3.deleteScrape3)
//routes.get("/delete-scrape-3-cars",scrape_3.deleteScrape3Cars)

//Users Controllers

routes.post("/register",usersController.registerUser)
routes.post("/login",usersController.loginUser)
routes.get("/user",usersController.getUser)

//Dashboard Controllers
routes.get("/getArray/:startSlice?/:endSlice?",verifyToken,dashboardController.getCarArray)
routes.get("/getCars/:marca?",dashboardController.getAllCars)
routes.get("/car/:car_id?",dashboardController.getCarById)
routes.post("/favoritesUpdate",dashboardController.updateFavourites)
routes.post("/favoritesDelete",dashboardController.deleteFavourites)
routes.get("/getFavoritos",dashboardController.getFavourites)

//Single Car Controller
routes.get("/query/:car_id?",dashboardController.getCarById)

//testController

routes.get("/find-car/:marca",testController.checkIfExists)

//Query Controller

routes.get("/search/:marca?/:ano?/:ubicacion?",queryController.getCars)
routes.get("/search2/",queryController.getAllBrands)
routes.get("/todas_ubicaciones/",queryController.getAllLocations)


module.exports=routes