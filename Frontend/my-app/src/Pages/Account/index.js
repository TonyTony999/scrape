import React, { Component } from "react"
import api from "../../services/api";
import "./index.css"


class myAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
        this.getUser = this.getUser.bind(this)
    }

    async getUser() {
        let user_id = localStorage.getItem("user_id")
        await api.get("/user", { headers: { user_id } }).then(res => {
            if (res.data.length !== 0) {
                this.setState({ user: res.data[0] })
            }
        })

    }

    componentDidMount() {
        this.getUser().then(res => {
            console.log("this is user", this.state.user)
        })
    }

    render() {
        return (

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
                    </div>
                </div>
                <div id="account_config">
                    <h3><strong>Configuración de Cuenta</strong></h3>
                    <br></br>
                    <div className="account_info"><h4>Nombre: </h4><h5>{this.state.user.firstName}</h5> </div>
                    <div className="account_info"><h4>Apellido: </h4><h5>{this.state.user.lastName}</h5> </div>
                    <div className="account_info"><h4>Email: </h4><h5>{this.state.user.email}</h5> </div>
                    <div className="account_info"><h4>Contraseña: </h4><h5>{this.state.user.password}</h5> </div>
                </div>
                <div id="my_favourites">
                

                </div>




            </div>

        )
    }

}

export default myAccount

