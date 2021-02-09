import React, { Component, useState, useEffect } from "react"
import api from "../../services/api";
import { Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import "./index.css"


class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            misFavoritos: [],
            array: [],
            dividedArray: [],
            currentArrIndex: 0,
            startSlice: 0,
            endSlice: 200,
            nextIndex: 0,
            searchMarca: "default",
            searchAno: "default",
            searchUbicacion: "default",
            sorting_type: "default",
            allBrands: [],
            allUbicaciones: [],
            queryArrayOfArrays: [],
            queryArrayOfArraysIndex: 0,
            randomImg: ""
        }


        this.getResults = this.getResults.bind(this)
        this.divideArray = this.divideArray.bind(this)
        this.divideArrayOfArrays = this.divideArrayOfArrays.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.getAllUbicaciones = this.getAllUbicaciones.bind(this)
        this.getUser = this.getUser.bind(this)
        this.handle_submit = this.handle_submit.bind(this)
        this.handle_submit_2 = this.handle_submit_2.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.sorting = this.sorting.bind(this)
        this.resetButtonsColor = this.resetButtonsColor.bind(this)
        this.createRandomGallery = this.createRandomGallery.bind(this)
        this.update_favorites=this.update_favorites.bind(this)
        this.delete_favorites=this.delete_favorites.bind(this)

    }



    divideArray(arr) {

        let dividedArr = []
        let cell = []
        for (let i = 0; i < arr.length; i++) {
            if (cell.length < 20) {
                cell.push(arr[i])
            }
            else {
                dividedArr.push(cell)
                cell = []
                cell.push(arr[i])
            }
        }
        dividedArr.push(cell)
        return dividedArr
    }

    divideArrayOfArrays(arr) {
        let dividedArr = []
        let cell = []
        for (let i = 0; i < arr.length; i++) {
            if (cell.length < 10) {
                cell.push(arr[i])
            }
            else {
                dividedArr.push(cell)
                cell = []
                cell.push(arr[i])
            }
        }
        dividedArr.push(cell)
        return dividedArr

    }


    async getResults() {
        const { history } = this.props;
        const user_id = localStorage.getItem("user_id")
        const token = localStorage.getItem("token")

        await api.get(`/getArray/${this.state.startSlice}/${this.state.endSlice}`, { headers: { user_id, token } }).then(res => {
            console.log("this is array", res.data[0].car_lista)
            this.setState({ array: res.data[0].car_lista })
        }).catch(err => {
            history.push("/login")

        })
    }

    async getAllBrands() {
        let response = await api.get("/search2/")
        if (response && response.length !== 0) {
            let allCars = response.data
            let brandsArray = []
            allCars.forEach(element => {
                brandsArray.push(element.marca)
            })
            return brandsArray

        }
    }

    async getAllUbicaciones() {
        let ubicacion = await api.get("/todas_ubicaciones/")
        if (ubicacion) {
            return ubicacion.data[0].ubicaciones
        }
    }

    async getUser() {
        let user_id = localStorage.getItem("user_id")
        await api.get("/user", { headers: { user_id } }).then(res => {
            if (res.data.length !== 0) {
                this.setState({ user: res.data[0] })
                this.setState({ misFavoritos: res.data[0].myFavourites })
            }
        })

    }

    resetButtonsColor(div_id) {
        let btn = document.getElementById(div_id)
        let buttns = document.getElementsByClassName("butt")

        for (let i = 0; i < buttns.length; i++) {
            buttns[i].style.backgroundColor = "gray"
        }
        btn.style.backgroundColor = "white"
    }


    handleClick(event) {
        // event.preventDefault()
        event.stopImmediatePropagation()
        if (event.target.id === "next") {

            if (this.state.queryArrayOfArrays.length !== 0) {
                this.setState({ queryArrayOfArraysIndex: this.state.queryArrayOfArraysIndex + 1 });
                this.setState({ currentArrIndex: 0 })
                this.setState({ nextIndex: this.state.nextIndex + 10 })
                this.setState({ dividedArray: this.state.queryArrayOfArrays[this.state.queryArrayOfArraysIndex] })
                this.resetButtonsColor("button_0")

                window.scrollTo(0, 0)
            }

            else {
                this.setState({ startSlice: this.state.startSlice + 200, nextIndex: this.state.nextIndex + 10 })
                this.getResults().then(async res => {
                    this.setState({ dividedArray: this.divideArray(this.state.array) })//
                })

                this.resetButtonsColor("button_0")
                window.scrollTo(0, 0)
            }
        }
        else if (event.target.id === "previous") {

            if (this.state.queryArrayOfArrays.length !== 0) {

                this.setState({ queryArrayOfArraysIndex: this.state.queryArrayOfArraysIndex - 1 });
                this.setState({ currentArrIndex: 0 })
                this.setState({ nextIndex: this.state.nextIndex - 10 })
                this.setState({ dividedArray: this.state.queryArrayOfArrays[this.state.queryArrayOfArraysIndex] })
                window.scrollTo(0, 0)

            }
            else {
                this.setState({ startSlice: this.state.startSlice - 200, nextIndex: this.state.nextIndex - 10 })
                this.getResults().then(async res => {
                    this.setState({ dividedArray: this.divideArray(this.state.array) })//
                })
                window.scrollTo(0, 0)
            }

        }
        else if (event.target.id.match(/button/gi)) {
            this.setState({ currentArrIndex: parseInt(event.target.innerHTML) - this.state.nextIndex })
            this.resetButtonsColor(event.target.id)
            this.update_favorites()
            window.scrollTo(0, 0)
            
            console.log(this.state.misFavoritos)

        }
        else if (event.target.id === "min_price") {
            this.setState({ sorting_type: "min_price" })
            console.log(this.state.sorting_type)
        }
        else if (event.target.id === "price") {
            this.setState({ sorting_type: "price" })
            console.log(this.state.sorting_type)
        }
        else if (event.target.id === "fecha") {
            this.setState({ sorting_type: "fecha" })
            console.log(this.state.sorting_type)
        }
        else if (event.target.id.match(/favorite_container_/g)) {

            let event_ = event.target.id
            let favorite_id = event_.split("favorite_container_")[1]
            let my_favorites_array = [...this.state.misFavoritos]
            let is_id_present = my_favorites_array.indexOf(favorite_id)


            if (is_id_present !== -1) {
                my_favorites_array.splice(is_id_present, 1)
                this.setState({ misFavoritos: my_favorites_array })
                //this.remove_favorites(favorite_id)
            }
            else {
                my_favorites_array.push(favorite_id)
                this.setState({ misFavoritos: my_favorites_array })
                //this.add_favorites(favorite_id)
               
            }

        }
        else if(event.target.id==="log_out"){
            localStorage.removeItem("token")
            localStorage.removeItem("user_id")
        }
        else if(event.target.id==="favoritos"){
            this.update_favorites(this.state.misFavoritos)
        }
    }


    async update_favorites(){
        let favoritos=this.state.misFavoritos
        let id=localStorage.getItem("user_id")
        await api.post("/favoritesUpdate",{favoritos,id})
    }

    async delete_favorites(){
        let id=localStorage.getItem("user_id")
        await api.post("/favoritesDelete",{id})

    }



    async handle_submit(event) {

        event.preventDefault()
        return await api.get(`/search/${this.state.searchMarca}/${this.state.searchAno}/${this.state.searchUbicacion}`).then(async res => {

            res.data.length < 200 ? this.setState({ dividedArray: this.divideArray(res.data), currentArrIndex: 0, array: res.data }) :

                this.setState({ array: res.data })
            this.setState({ queryArrayOfArrays: this.divideArrayOfArrays(this.divideArray(res.data)) })
            this.setState({ dividedArray: this.state.queryArrayOfArrays[0], currentArrIndex: 0, nextIndex: 0 })
            this.resetButtonsColor("button_0")
            //let control_lateral_div=document.getElementById("control_lateral");
            // control_lateral_div.style.

        })

    }

    async handle_submit_2(event) {

        event.preventDefault()
        switch (this.state.sorting_type) {
            case "min_price":
                this.sorting(this.state.array, "min_price").then(async res => {
                    console.log("state array", this.state.array)
                    this.setState({ queryArrayOfArrays: res })
                    this.setState({ dividedArray: this.state.queryArrayOfArrays[0] })
                })
                break;
            case "price":
                this.sorting(this.state.array, "price").then(async res => {
                    console.log("state array", this.state.array)
                    this.setState({ queryArrayOfArrays: res })
                    this.setState({ dividedArray: this.state.queryArrayOfArrays[0] })
                })
                break;
            case "price":
                this.sorting(this.state.array, "fecha").then(async res => {
                    console.log("state array", this.state.array)
                    this.setState({ queryArrayOfArrays: res })
                    this.setState({ dividedArray: this.state.queryArrayOfArrays[0] })
                })
                break;

            //console.log("sorted" , this.sorting(this.state.array,"min_price"))
        }
    }

    handleChange(event) {

        console.log(event.target.value)
        if (event.target.id === "search_marca") {
            this.setState({ searchMarca: event.target.value })
            console.log(this.state.searchMarca)
        }
        else if (event.target.id === "search_year") {
            this.setState({ searchAno: event.target.value })
        }
        else if (event.target.id === "search_ubicacion") {
            this.setState({ searchUbicacion: event.target.value })
            //console.log(this.state.searchUbicacion)
        }

    }

    async sorting(arr, sort_type) {

        let newArr = [...arr]
        let decomposedArr = []

        switch (sort_type) {
            case "min_price":
                decomposedArr = newArr.sort(function (a, b) {
                    let minPriceDif_1 = a.minPriceDif.match(/[0-9]+/g)
                    let minPriceDif_2 = b.minPriceDif.match(/[0-9]+/g)
                    let symbolMatch_1 = a.minPriceDif.match(/-/g)
                    symbolMatch_1 && symbolMatch_1.length !== 0 ? symbolMatch_1 = symbolMatch_1[0] : symbolMatch_1 = ""
                    let symbolMatch_2 = b.minPriceDif.match(/-/g)
                    symbolMatch_2 && symbolMatch_2.length !== 0 ? symbolMatch_2 = symbolMatch_2[0] : symbolMatch_2 = ""

                    return parseInt(`${symbolMatch_1}${minPriceDif_1}`) -
                        parseInt(`${symbolMatch_2}${minPriceDif_2}`)
                })
                decomposedArr = this.divideArray(decomposedArr)
                decomposedArr = this.divideArrayOfArrays(decomposedArr)
                return decomposedArr
                break;
            case "price":
                decomposedArr = newArr.sort(function (a, b) {
                    let str_1 = a.price
                    let str_2 = b.price
                    str_1 = str_1.match(/[0-9]+/g)
                    str_1 = str_1.join("")
                    str_2 = str_2.match(/[0-9]+/g)
                    str_2 = str_2.join("")
                    return str_1 - str_2
                })
                decomposedArr = this.divideArray(decomposedArr)
                decomposedArr = this.divideArrayOfArrays(decomposedArr)
                return decomposedArr
                break;
            case "fecha":
                decomposedArr = newArr.sort(function (a, b) {
                    let date_1 = new Date(a.date);
                    let date_2 = new Date(b.date);
                    return date_1 - date_2
                })
                decomposedArr = this.divideArray(decomposedArr)
                decomposedArr = this.divideArrayOfArrays(decomposedArr)
                return decomposedArr
                break;

        }
    }

    createRandomGallery() {
        setInterval(() => {
            let index = Math.floor(Math.random() * this.state.array.length - 2)
            this.state.array[index] ?
                this.setState({ randomImg: this.state.array[index].img }) :
                this.setState({ randomImg: this.state.array[0].img })
        }, 4000)
    }



    

    componentDidMount() {


        this.getResults().then(res => {
            this.setState({ dividedArray: this.divideArray(this.state.array) })
            this.getAllBrands().then(res => { this.setState({ allBrands: res }) })
            this.getAllUbicaciones().then(res => { this.setState({ allUbicaciones: res }) })
            this.getUser().then(res1 => {
                console.log(this.state.user)
                console.log("mis favoritos carros", this.state.misFavoritos)
            })
            this.state.array.length!==0? this.createRandomGallery():console.log("none")
           

        })

    }

    render() {
        document.addEventListener("click", (event) => { this.handleClick(event) })
        return (
            <>
                <div className="contain">
                    <div className="navbar">
                        <div id="left_div">
                            <a href="http://localhost:3000/dashboard">
                                <img id="auto_icon" src={require("../../Images/car_top_suv_auto-512.png")}></img>
                            </a>
                        </div>
                        <div id="right_div">
                            <h6 id="user-name">Bienvendo {this.state.user.firstName}</h6>
                            <div id="circular_profile_pic">
                                <a href="http://localhost:3000/my-account" target="_blank">
                                    <img id="car_profile" src={require("../../Images/car_profile.jpg")} ></img>
                                </a>
                                
                            </div>
                            <div id="dropdown_menu">
                                    <a id="mi_cuenta" href="http://localhost:3000/my-account" target="_blank">Mi Cuenta</a>
                                    <a id="log_out" href="http://localhost:3000/login">Cerrar Sesión y Guardar Favoritos</a>
                                    <a id="favoritos" href="http://localhost:3000/favourites" target="_blank">Mis Favoritos</a>
                            </div>
                        </div>
                    </div>
                    <div id="form_div">
                        <Form onSubmit={async (event) => this.handle_submit(event)}>
                            <label for="search_marca">Marcas</label>
                            <select id="search_marca" name="search_marca" onChange={event => this.handleChange(event)}>
                                <option value="default">TODAS</option>
                                {this.state.allBrands.map(element => {
                                    return <option value={element} key={"_" + element}>{element.toUpperCase()}</option>
                                })}

                            </select>
                            <label for="search_year">Año</label>
                            <select id="search_year" name="search_year" onChange={event => this.handleChange(event)}>
                                <option value="default">TODOS</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                            </select>
                            <label for="search_ubicacion">Ubicación</label>
                            <select id="search_ubicacion" name="search_ubicacion" onChange={event => this.handleChange(event)} >
                                <option value="default">TODAS</option>
                                {
                                    this.state.allUbicaciones ? this.state.allUbicaciones.map(element => {
                                        return <option value={element} key={"_" + element}>{element}</option>
                                    }) : "loading"
                                }

                            </select>
                            <input type="submit"></input>
                        </Form>

                        <div id="main_banner">{
                            this.state.array.length !== 0 ? <img id="random_gallery_img" src={this.state.randomImg}></img> : ""
                        }
                        </div>

                    </div>

                    {this.state.queryArrayOfArrays.length !== 0 ? <div>{`${this.state.array.length} Publicaciones Encontradas`} </div> : ""}
                    <div id="dashboard_wrapper">

                        {
                            this.state.queryArrayOfArrays.length !== 0 ?
                                <div id="control_lateral">
                                    <Form onSubmit={async (event) => this.handle_submit_2(event)} id="lateral_form">
                                        <div>Ordenar Por:</div>
                                        <label for="min_price">Precio Mínimo:</label>
                                        <input type="radio" name="sorting" id="min_price" value="min_price" onChange={event => this.handleClick(event)}>
                                        </input>
                                        <label for="price">Precio</label>
                                        <input type="radio" name="sorting" id="price" value="price" onChange={event => this.handleClick(event)} >
                                        </input>
                                        <label for="fecha">Fecha</label>
                                        <input type="radio" name="sorting" id="fecha" value="fecha" onChange={event => this.handleclick(event)} >
                                        </input>
                                        <input type="submit" value="Ordenar"></input>
                                    </Form>

                                </div>
                                : ""

                        }


                        <div className="wrapper">

                            {
                                this.state.dividedArray.length === 0 ? <div><h2>CARGANDO</h2></div> : this.state.dividedArray[this.state.currentArrIndex].map((element, index) => {
                                    return (<div key={index} className="cars" id={element._id}>
                                        <div id="title_and_icon_div">
                                            <h2 style={{ textAlign: "center" }} >{element.title}</h2>
                                            <div className="favorite_container"  >
                                                {this.state.misFavoritos.indexOf(element._id) !== -1 ? <img className="filled_star" onClick={event => this.handleClick(event)} id={`favorite_container_${element._id}`}
                                                    src={require("../../Images/filled_star_2.png")}></img> :
                                                    <img className="empty_star" id={`favorite_container_${element._id}`} onClick={event => this.handleClick(event)}
                                                        src={require("../../Images/empty_star.jpg")}></img>}
                                            </div>
                                        </div>
                                        <div className="gallery-container">
                                            <a href={`http://localhost:3000/car/${element._id}`} target="_blank"><img src={element.img}></img></a>
                                        </div>
                                        <ul>
                                            <li><strong>Precio</strong> {element.price}</li>
                                            <li><strong>Fecha: </strong>{element.date} </li>
                                            <li><strong>Año: </strong>{element.year[0]} </li>
                                            <li><strong>{element.minPriceDif.toString().match(/-/) ? <h3 id="positive_">{element.minPriceDif}</h3> : <h3 id="negative_">{element.minPriceDif}</h3>}</strong> de diferencia con version mas barata</li>
                                            <li><strong>{element.maxPriceDif.toString().match(/-/) ? <h3 id="positive_">{element.maxPriceDif}</h3> : <h3 id="negative_">{element.maxPriceDif}</h3>}</strong> de diferencia con la version mas cara</li>
                                            <li><strong>{element.averagePriceDif.toString().match(/-/) ? <h3 id="positive_">{element.averagePriceDif}</h3> : <h3 id="negative_">{element.averagePriceDif}</h3>}</strong> de diferencia con promedio de precio de versiones</li>
                                        </ul>

                                    </div>)
                                })}
                        </div>
                    </div>
                    <div className="button-wrapper" >
                        {<Buttons num={this.state.dividedArray} nextIndex={this.state.nextIndex}></Buttons>}

                    </div>
                </div>
            </>
        )
    }
}

class Buttons extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center" }}>

              {this.props.nextIndex!==0?<div id="previous">prev</div>:""} 
                
                {  this.props.num.map((element, index) => {
                    return (<div key={index} className="butt" id={`button_${index}`} style={{ width: "50px", height: "50px", backgroundColor: "gray", display: "flex",
                     flexDirection: "row", marginLeft: "5px", justifyContent: "center", alignItems: "center" }}>{index + this.props.nextIndex}</div>)

                })}
                
                {this.props.num.length>=9?<div id="next">next</div>:"" }
                 
            </div>

        )
    }
}


export default DashBoard
