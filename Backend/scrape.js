const cheerio = require("cheerio")
const axios = require("axios")
const express = require("express")
const Cars = require("./Models/Cars")
const carModels = require("./Models/CarModels")
const Years = require("./Models/Years")
const Prices = require("./Models/Prices")
const { findByIdAndDelete } = require("./Models/Cars")


module.exports = {

  async getResults(req, res) {
    
    //"https://carros.tucarro.com.co/_Desde_97"
    await axios.get("https://carros.tucarro.com.co/_PublishedToday_YES")
      .then((response) => {
        const list = []
        const $ = cheerio.load(response.data)
        //console.log($("#searchResults").html())
        $("li", "#searchResults").each((index, element) => {
          const imag = $(element).find("div>div>div>ul>li>a").html()
          const link = $(element).find("div>div>div>ul>li").html()
          list.push({
            html: $(element).text(),
            img: imag,
            link: link
          })
        })

        let filteredList = []
        list.forEach((element, index) => {
          if (element.html && element.img) {
            filteredList.push(element)
          }
        })
        filteredList.forEach((element, index) => {
          let prevImg = element.img
          let ocurrance = prevImg.search("src")
          let quoteOcurrance = element.link.indexOf('"')
          let partialLink = element.link.slice(quoteOcurrance + 1)
          element.link = partialLink.slice(0, partialLink.indexOf('"'))
          element.img = prevImg.slice(ocurrance, prevImg.length - 2)

        })

       // filteredList = filteredList.slice(10, 13)
        async function getLinks() {
          const linkList = []
          const imgArr=[]
          for (let i = 0; i < filteredList.length; i++) {
            await axios.get(filteredList[i].link).then(
              res => {
                let testregex = /<\w*>\w*<\/\w*>/gi
                let testregex2 = /<\w*>(.*)<\/\w*>/gi
                let imgRegex=/data-full-images="(.*)"/i
                let imgLinkRegex=/https:\/\/[a-z0-9-/_.]+.jpg/gi
                const $ = cheerio.load(res.data)
                let mainDiv = $(".nav-main-content", "main").find("div>div>div>section>div>div>div>section>ul").html()
                let imgs=$(".nav-main-content", "main").find("div>div>div>div>div>div>div").html()
                imgs=imgs.match(imgRegex)[0]
                imgs=imgs.match(imgLinkRegex)
                mainDiv = mainDiv.match(testregex2)
                mainDiv.push({imgs:imgs})
                linkList.push(mainDiv)

              })

          }
          return linkList
        }

        getLinks().then(response => {
         //res.send(response)

          //console.log(response)

          const linkList = response

          const ubicacion = [{
            loc: "Bogotá D.C", num: 21511
          }, { loc: "Antioquia", num: 10013 }, { loc: "Valle Del Cauca", num: 4389 }, { loc: "Cundinamarca", num: 2006 }
            , { loc: "Risaralda", num: 1452 }, { loc: "Norte De Santander", num: 263 }, { loc: "Santander", num: 1319 }, { loc: "Atlántico", num: 1067 }
            , { loc: "Caldas", num: 577 }, { loc: "Boyaca", num: 555 }, { loc: "Meta", num: 533 }, { loc: "Tolima", num: 459 }, { loc: "Quindío", num: 342 }, {
            loc: "Bolívar", num: 332
          }, { loc: "Huila", num: 325 }, { loc: "Nariño", num: 304 }, { loc: "Córdoba", num: 169 }
            , { loc: "Cauca", num: 159 }, { loc: "Cesar", num: 159 }, { loc: "Magdalena", num: 135 }, { loc: "Sucre", num: 34 }, { loc: "Caqueta", num: 29 }
            , { loc: "Guajira", num: 18 }, { loc: "Putumayo", num: 14 }, { loc: "Arauca", num: 13 }, { loc: "Casanare", num: 13 }, { loc: "Choco", num: 13 }
            , { loc: "Amazonas", num: 6 }, { loc: "Guaviare", num: 2 }, { loc: "Vichada", num: 2 }]

          function getLoc(str) {
            let y = ""
            for (let i = 0; i < ubicacion.length; i++) {
              let x = str.match(`${ubicacion[i].loc}`)
              if (x && x[0].length > y.length) {
                y = x[0]
              }
            }
            return y
          }

          filteredList.forEach((element, index) => {
            let marca = linkList[index][linkList[index].indexOf('<strong>Marca</strong>') + 1]
            let modelo = linkList[index][linkList[index].indexOf('<strong>Modelo</strong>') + 1]
            let ano = linkList[index][linkList[index].indexOf('<strong>A&#xF1;o</strong>') + 1]
            let kilometraje = linkList[index][linkList[index].indexOf('<strong>Kil&#xF3;metros</strong>') + 1]
            let version = linkList[index][linkList[index].indexOf('<strong>Versi&#xF3;n</strong>') + 1]
            let cilindrada = linkList[index][linkList[index].indexOf('<strong>Cilindrada</strong>') + 1]


            element["marca"] = marca.match(/>(.*)</gi)[0].match(/[a-z0-9&#]/gi).join("")
            element["modelo"] = modelo.match(/>(.*)</gi)[0].match(/[a-z0-9&#]/gi).join("")
            element["version"] = version.match(/>(.*)</gi)[0].match(/[a-z0-9&#]/gi).join("")
            element["ano"] = ano.match(/>(.*)</gi)[0].match(/[a-z0-9]/gi).join("")
            element["kilometraje"] = kilometraje.match(/>(.*)</gi)[0].match(/[a-z0-9]/gi).join("")
            element["cilindrada"] = cilindrada.match(/>(.*)</gi)[0].match(/[a-z0-9]/gi).join("")
            element["precio"] = element.html.match(/\d+.\d+.\d+./gi)[0]
            element["ubicacion"] = getLoc(element.html)
            element["fotos"]=linkList[index][linkList[index].length-1].imgs

          })
          //console.log(filteredList)
          //res.send(filteredList)
          async function saveList() {
            for (let i = 0; i < filteredList.length; i++) {
              let data = await Cars.find({ html: filteredList[i].html })
              if (data.length === 0) {
                await Cars.create({
                  html: filteredList[i].html,
                  img: filteredList[i].img,
                  link: filteredList[i].link,
                  marca: filteredList[i].marca,
                  modelo: filteredList[i].modelo,
                  version: filteredList[i].version,
                  ano: filteredList[i].ano,
                  kilometraje: filteredList[i].kilometraje,
                  cilindrada: filteredList[i].cilindrada,
                  precio: filteredList[i].precio,
                  ubicacion: filteredList[i].ubicacion,
                  fotos:filteredList[i].fotos
                })
              }
              // console.log(data)
            }
            return filteredList
          }

          saveList().then(response2 => {
            return res.send(response2)
          })
        })
      })

  },

  async getPrices(req, res) {
    axios.get("https://www.autocosmos.com.co/guiadeprecios").then(response => {
      const $ = cheerio.load(response.data)

      let results = $("main").find("section>form>div>div>select").html()
      results = results.match(/"[a-z-]+"/gi)
      let arr2 = results.map(element => {
        return element = element.match(/[a-z-]+/gi)[0]
      })
      //console.log(arr2)
      //arr2 = arr2.slice(10, 15)
      //const arr=results.match(/[a-z-]+/gi)
      //console.log(arr)
      async function getModels() {
        console.log(arr2)
        const marcas = []
        for (let i = 0; i < arr2.length; i++) {
          await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${arr2[i]}`).then(response => {
            const $ = cheerio.load(response.data)
            let results = $("main").find("section>form>div>div").next().find("select").html()
            results = results.match(/"[a-z0-9-]+"/gi)
            let results2 = results.map(element => {
              return element = element.match(/[a-z0-9-.]+/gi)[0]
            })
            marcas.push({
              marca: arr2[i],
              modelos: results2
            })
          })
        }
        return marcas
      }
      getModels().then(results1 => {
        //return res.send(results1)
        async function saveModels() {
          for (let i = 0; i < results1.length; i++) {
            let data = await carModels.find({ marca: results1[i].marca })
            if (data.length === 0) {
              await carModels.create({
                marca: results1[i].marca,
                modelos: results1[i].modelos
              })
            }

          }
          return results1
        }
        saveModels().then(response => {
          console.log(response)
          return res.send(response)
        })
      })
    })
  },

  async deleteCarModels(req, res) {

    async function getCars() {
      let results = await carModels.find({})
      return results
    }
    getCars().then(results => {
      let ids = []
      for (let i = 0; i < results.length; i++) {
        if (results[i].modelos.length === 0) {
          console.log(results[i].marca)
          ids.push(results[i]._id)
        }
      }
      for (let i = 0; i < ids.length; i++) {
        carModels.findByIdAndDelete(ids[i], (err) => {
          if (err) {
            console.log(err)
          }

        })
      }
      //console.log("first result is",results[0].modelos)
    })

    // console.log(results)

  },

  async deleteAllCars(req, res) {
    let cars = await Cars.find({})
    let ids = []
    cars.forEach(element => {
      ids.push(element._id)
    })
    for (let i = 0; i < ids.length; i++) {
      await Cars.findByIdAndDelete(ids[i]._id)
    }

    return res.send("all cars deleted")

  }

  , async getYears(req, res) {
    let data = await carModels.find({})
    data = data.slice(0,10)

    async function getArray() {
      const years = []
      for (let i = 0; i < data.length; i++) {
        //let cell = { marca: data[i].marca, modelos: [] }
        for (let j = 0; j < data[i].modelos.length; j++) {
          await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${data[i].marca}&Modelo=${data[i].modelos[j]}`).then(respons => {
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
        return res.send(response2)
      })
    })

  },
  async deleteAllYears(req, res) {
    let years = await Years.find({})
    let ids = []
    years.forEach(element => {
      ids.push(element._id)
    })
    for (let i = 0; i < ids.length; i++) {
      await Years.findByIdAndDelete(ids[i]._id)
    }

    return res.send("all years deleted")

  },

  async getFinalPrices(req,res){
    let years = await Years.find({})
    years=years.slice(0,5)
    let prices=[]
    async function getArray(){
      for(let i=0;i<years.length;i++){
        for(let j=0;j<years[i].anos.length;j++){
          await axios.get(`https://www.autocosmos.com.co/guiadeprecios?Marca=${years[i].marca}&Modelo=${years[i].modelo}&A=${years[i].anos[j]}`).then(response=>{
         let $=cheerio.load(response.data)
         let prix=($("main").find("section>div>div>div>div>section>div>table>tbody").html())
         let version=prix.match(/<span>(.*)<\/span>/gi)
         let prix2=prix.match(/\$\d+.\d+.\d+/gi)
         let defArr=[]
         version.forEach((element,index)=>{
           defArr.push({version:element,precio:prix2[index]})
         })
  
         prices.push({marca:years[i].marca,modelo:years[i].modelo,anos:years[i].anos[j], precio:defArr })
  
        })
        }
        
      }
      return prices
    }
    getArray().then(response=>{
      async function saveList(){
        let arr=[]
        for (let i=0;i<response.length;i++){
          let data=await Prices.find({modelo:response[i].modelo, anos:response[i].anos})
          if(data.length===0){
            let item=await Prices.create({
              marca:response[i].marca,
              modelo:response[i].modelo,
              anos:response[i].anos,
              precio:response[i].precio
            })
            arr.push(item)
          }
        }
        return arr
      }

      saveList().then(results=>{
        console.log(results)
        return res.send(results)
      })
    })
   
    
  },
  async deletePrices(req, res) {
    let prices = await Prices.find({})
    let ids = []
    prices.forEach(element => {
      ids.push(element._id)
    })
    for (let i = 0; i < ids.length; i++) {
      await Prices.findByIdAndDelete(ids[i]._id)
    }

    return res.send("all prices deleted")

  }

  

}



