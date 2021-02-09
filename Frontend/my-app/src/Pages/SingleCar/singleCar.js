import React, { Component, useState, useEffect } from "react"
import api from "../../services/api";
import { Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import "./index.css"




class singlePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            marca: "",
            modelo: "",
            precio: "",
            ano: "",
            kilometraje: "",
            ubicacion: "",
            foto: "",
            link: "",
            versiones: [],
            minPrice:"",
            maxPrice:"",
            avPrice:"",
            test:""

        }

        this.getRes = this.getRes.bind(this)
        this.convertNum=this.convertNum.bind(this)

    }
    async getRes() {
        let results = await api.get(`/car/${this.props.match.params.car_id}`)
        return results.data
    }

    

    componentDidMount() {
        this.getRes().then(res => {
            this.setState({
                title: res.title,
                marca: res.marca,
                modelo: res.modelo,
                precio: res.price,
                ano: res.year,
                kilometraje: res.kilometraje,
                ubicacion: res.ubicacion,
                foto: res.img,
                link: res.link,
                versiones: res.versiones,
                minPrice:res.minPrice,
                maxPrice:res.maxPrice,
                avPrice:res.averagePrice,
                
            })
            
        })

    }

    convertNum(num){
        let str=num.toString()
        if(str.length===9){
          let newStr="$"+str.substring(0,3)+"."+"000.000"
          return newStr
        }
        
       else if(str.length===8){
          let newStr="$"+str.substring(0,2)+"."+"000.000"
          return newStr
        }
        else if(str.length===7){
          let newStr="$"+str.substring(0,1)+"."+str.substring(1,2)+"00.000"
          return newStr
        }
        
      }

    render() {

        return (<div className="container">
            <h2>{this.state.title}</h2>
            <div id="car_info">
                <div id="list_div">
                    <ol>
                        <li><strong>Marca:</strong>{this.state.marca}</li>
                        <li><strong>Modelo:</strong>{this.state.versiones.length !== 0 ? this.state.versiones[0].modelo : "nothing"}</li>
                        <li><strong>Precio:</strong>{this.state.precio}</li>
                        <li><strong>Año:</strong>{this.state.ano}</li>
                        <li><strong>Kilometraje:</strong>{this.state.kilometraje}</li>
                        <li><strong>Ubicacion:</strong>{this.state.ubicacion}</li>
                        <li><a href={this.state.link} target="_blank">publicacion</a></li>
                        <br>
                        </br>
                        <li><strong>Min-Price:</strong>{this.convertNum(this.state.minPrice)}</li>
                        <li><strong>Max-Price:</strong>{this.convertNum(this.state.maxPrice)}</li>
                        <li><strong>Average-Price:</strong>{this.convertNum(this.state.avPrice)}</li>

                    </ol>

                </div>
                <div id="img_div">
                    <img src={this.state.foto}></img>
                </div>

            </div>
            <div id="versiones_list_div">
                {
                    this.state.versiones.map((element,index) => {
                        return (
                            <ol style={{ textAlign: "left" }} id={"version_"+index} >
                                <li><strong>Modelo:</strong> {element.modelo}</li>
                                <li><strong>Version:</strong>{element.version}</li>
                                <li><strong>Precio:</strong>{element.precio}</li>
                                <li><strong>Año:</strong>{element.ano}</li>
                                <li><strong>Matches:</strong> {element.matches.map(element2 => {
                                    return (
                                        <ol>
                                            <li>{element2}</li>
                                        </ol>
                                    )
                                })}</li>

                            </ol>
                        )
                    })}
            </div>
        </div>)
    }


}

export default singlePage