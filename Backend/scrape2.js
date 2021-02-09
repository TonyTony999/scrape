const cheerio = require("cheerio")

const carModels = require("./Models/CarModels.js")
const ubicacionesModel = require("./Models/Ubicaciones")
const scrape3Models = require("./Models/scrape3Models.js")
const Years = require("./Models/Years")
const Prices = require("./Models/Prices")
const scrape3Cars = require("./Models/scrape3Cars.js")


const mongoose = require("mongoose")
require("dotenv").config()
const MONGO_URL = process.env.MONGO_URL
const axios = require("axios")


//const scraping3 = require("./scrape3.js")

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })



async function getYears() {

  async function getArray() {
    let data = await carModels.find({})
    data = data.slice(145, 151)
    const years = []
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].modelos.length; j++) {

        await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${data[i].marca}&Modelo=${data[i].modelos[j]}`)
          .then(respons => {
            const $ = cheerio.load(respons.data)
            let anos1 = $("main").find("section>form>div>div").next().next().html()
            anos1 = anos1.match(/>\d+</gi)
            anos1 = anos1.map(element => {
              return element = element.match(/\d+/gi)[0]
            })
            years.push({ marca: data[i].marca, modelo: data[i].modelos[j], anos: anos1 })

          })
      }

    }
    return years
  }
  getArray().then(response1 => {
    async function saveYears() {
      let added = []
      for (let i = 0; i < response1.length; i++) {
        let years1 = await Years.find({ modelo: response1[i].modelo })
        if (years1.length === 0) {
          let item = await Years.create({
            marca: response1[i].marca,
            modelo: response1[i].modelo,
            anos: response1[i].anos
          })
          added.push(item)
        }
      }
      return added
    }
    saveYears().then(response2 => {
      console.log(response2)
      return response2
    })
  })
}



async function getFinalPrices() {

  let years = await Years.find({})
  years = years.slice(2325, 2340)// already looped through
  let prices = []
  async function getArray() {
    for (let i = 0; i < years.length; i++) {
      for (let j = 0; j < years[i].anos.length; j++) {
        try {
          await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${years[i].marca}&Modelo=${years[i].modelo}&A=${years[i].anos[j]}`).then(response => {
            let $ = cheerio.load(response.data)
            let prix = ($("main").find("section>div>div>div>div>section>div>table>tbody").html())
            if (prix) {
              let version = prix.match(/<span>(.*)<\/span>/gi)
              let prix2 = prix.match(/\$\d+.\d+.\d+/gi)
              let defArr = []
              version.forEach((element, index) => {
                defArr.push({ version: element, precio: prix2[index] })
              })

              prices.push({ marca: years[i].marca, modelo: years[i].modelo, anos: years[i].anos[j], precio: defArr })

            }

          })

        } catch (error) {
          console.log(error, ` for ${years[i].marca} ${years[i].modelo} ${years[i].anos[j]}`)

        }

      }

    }
    return prices
  }
  getArray().then(response => {
    async function saveList() {
      let arr = []
      for (let i = 0; i < response.length; i++) {
        let item = await Prices.create({
          marca: response[i].marca,
          modelo: response[i].modelo,
          anos: response[i].anos,
          precio: response[i].precio
        })
        arr.push(item)

      }
      return arr
    }
    saveList().then(results => {
      return results
    })

  })

}



async function getSpecificModel(marca1, modelo1) {

  async function getArray(marca1, modelo1) {

    const years = []


    await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${marca1}&Modelo=${modelo1}`)
      .then(respons => {
        const $ = cheerio.load(respons.data)
        let anos1 = $("main").find("section>form>div>div").next().next().html()
        // console.log(anos1)
        anos1 = anos1.match(/>\d+</gi)
        anos1 = anos1.map(element => {
          return element = element.match(/\d+/gi)[0]
        })
        years.push({ marca: marca1, modelo: modelo1, anos: anos1 })

      })
    //console.log(years)
    return years
  }

  getArray(marca1, modelo1).then(response1 => {
    async function saveYears() {
      let added = []
      for (let i = 0; i < response1.length; i++) {
        // let years1 = await Years.find({ modelo: response1[i].modelo })
        // if (years1.length === 0) {
        let item = await Years.create({
          marca: response1[i].marca,
          modelo: response1[i].modelo,
          anos: response1[i].anos
        })
        added.push(item)
        // }
      }
      return added
    }
    saveYears().then(response2 => {
      console.log(response2)
      return response2
    })
  })
}

async function getSpecificPrices(marca1, modelo1, id) {

  let specificModel = await Years.findById(id)
  let prices = []
  async function getArray() {
    for (let i = 0; i < specificModel.anos.length; i++) {
      await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${marca1}&Modelo=${modelo1}&A=${specificModel.anos[i]}`).then(response => {
        let $ = cheerio.load(response.data)
        let prix = ($("main").find("section>div>div>div>div>section>div>table>tbody").html())
        if (prix) {
          let version = prix.match(/<span>(.*)<\/span>/gi)
          let prix2 = prix.match(/\$\d+.\d+.\d+/gi)
          let defArr = []
          version.forEach((element, index) => {
            defArr.push({ version: element, precio: prix2[index] })
          })

          prices.push({ marca: marca1, modelo: modelo1, anos: specificModel.anos[i], precio: defArr })

        }

      })
    }

    return prices
  }
  getArray(marca1, modelo1, id).then(response => {
    async function saveList() {
      let arr = []
      for (let i = 0; i < response.length; i++) {
        let item = await Prices.create({
          marca: response[i].marca,
          modelo: response[i].modelo,
          anos: response[i].anos,
          precio: response[i].precio
        })
        arr.push(item)

      }
      return arr
    }
    saveList().then(results => {
      return results
    })

  })

}

async function deleteDuplicates() {

  async function getIds() {
    try {
      let cars = await scrape3Models.find({})
      let scrapedCars = await scrape3Cars.find({})
      //scrapedCars=scrapedCars.slice(0,10)  
      let ids = []
      for (let i = 0; i < scrapedCars.length; i++) {
        let cell = []
        for (let j = 0; j < cars.length; j++) {
          if (scrapedCars[i].title === cars[j].title && scrapedCars[i].price === cars[j].price) {
            cell.push({ title: cars[j].title, id: cars[j]._id })
          }
        }
        ids.push(cell)
      }
      return ids
    }
    catch (err) {
      console.log("err is: ", err)
    }

  }

  async function deleteIds() {

    let ids = await getIds()
    let duplicateIds = []

    for (let z = 0; z < ids.length; z++) {
      if (ids[z].length > 1) {
        duplicateIds.push(ids[z].slice(1))
      }
    }

    for (let y = 0; y < duplicateIds.length; y++) {
      try {
        if (duplicateIds[y].length != 0) {
          for (let z = 0; z < duplicateIds[y].length; z++) {
            await scrape3Models.findByIdAndDelete(duplicateIds[y][z].id)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    return duplicateIds

  }
  return await deleteIds().then(res => console.log(res))

}

async function deleteDuplicates_2() {
  let cars = await scrape3Models.find({})
  let cars_2 = cars.slice()
  let deleted_ids = []
  for (let i = 0; i < cars.length; i++) {
    let count = 0
    for (let j = 0; j < cars_2.length; j++) {
      if (cars[i].title === cars_2[j].title) {
        count++
        if (count >= 2) {
          let removed = await scrape3Models.findByIdAndDelete(cars_2[j]._id)
          deleted_ids.push(cars_2[j].title)
        }
      }
    }
  }
  console.log(deleted_ids)
  console.log(deleted_ids.length)
}

async function getDates(args) {
  let query
  arguments.length != 0 ? query = { date: { $regex: new RegExp(String.raw`${args}`) } } : query = {};
  let cars = await scrape3Cars.find(query)
  console.log(cars)
}

async function getAllUbicaciones() {
  let cars = await scrape3Models.find({})
  let newArr = []
  if (cars) {
    cars.forEach(element => {
      if (newArr.indexOf(element.ubicacion) == -1) {
        newArr.push(element.ubicacion)
      }
    })
  }
  return newArr
}
/*getAllUbicaciones().then(res => {
  async function saveList() {
    let item = await ubicacionesModel.create({
      ubicaciones: res
    })
    return item
  }
  saveList().then(res2 => {
    console.log(res2)
  })

})*/


async function updateLocation() {

  try {

    let docs = await scrape3Models.find({})
    async function updateList() {
      if (docs) {
        //docs=docs.slice()
        let newArr = []
        for (let i = 0; i < docs.length; i++) {
          if (docs[i].ubicacion === "Bogot&#xE1; D.C.") {
            let item = await scrape3Models.updateOne({ _id: docs[i]._id },
              { ubicacion: "Bogota" })
            newArr.push(docs[i])
          }
          else if (docs[i].ubicacion === "Bol&#xED;var") {
            let item = await scrape3Models.updateOne({ _id: docs[i]._id },
              { ubicacion: "Bolivar" })
            newArr.push(docs[i])
          }
          else if (docs[i].ubicacion === "Atl&#xE1;ntico") {
            let item = await scrape3Models.updateOne({ _id: docs[i]._id },
              { ubicacion: "Atlantico" })
            newArr.push(docs[i])
          }
          else if (docs[i].ubicacion === "Nari&#xF1;o") {
            let item = await scrape3Models.updateOne({ _id: docs[i]._id },
              { ubicacion: "Nariño" })
            newArr.push(docs[i])
          }
          else if (docs[i].ubicacion === "C&#xF3;rdoba") {
            let item = await scrape3Models.updateOne({ _id: docs[i]._id },
              { ubicacion: "Cordoba" })
            newArr.push(docs[i])
          }

        }
        return newArr
      }
    }

    return await updateList()

  } catch (error) {
    console.log(error)
  }

}

async function deleteUbicaciones() {
  let ubicaciones = await ubicacionesModel.find({})
  if (ubicaciones && ubicaciones.length !== 0) {
    let ids = []
    for (let i = 0; i < ubicaciones.length; i++) {
      //ids.push(ubicaciones[i]._id)
      await ubicacionesModel.findByIdAndDelete(ubicaciones[i]._id)
    }

    console.log("deleted all ubicaciones")
  }
}

deleteDuplicates_2()

//deleteUbicaciones()


/*updateLocation().then(res=>{
  console.log(res)
})*/


//deleteDuplicates()

//scraping3.getDefResults()
//scraping3.allCars("Fri Dec 04 2020")
 //scraping3.allCars("Mon Oct 26 2020")
// scraping3.allCars("Thu Dec 03 2020")

//deleteScrape3Cars("Thu Dec 03 2020").then(res=>console.log(res))

//addCarsToArray("Fri Dec 04 2020")

//createArrayModel()

/*updateArray()
updateArray()
updateArray()
updateArray()
updateArray()
updateArray()
updateArray()*/


//sliceArray()

//removeArrayElement()

//verifyCarArr()

// getDates("Sun Nov 01 2020")

//getSpecificPrices("suzuki","vitara","5f36ad1de048638c0c16fe73").then(result=>{console.log(result)}) //ya for fiesta6
//getSpecificPrices("chevrolet","cruze-fl","5f1c65a811689f6188518edc").then(result=>{console.log(result)})
//getSpecificModel("suzuki","vitara").then(result=>{console.log(result)})
//getSpecificModel("mazda","3").then(result=>{console.log(result)})
//getFinalPrices().then(response=>{console.log(response)})

    //getYears2().then(result=>{console.log(result)})
    //getYears().then(result=>{console.log(result)})


