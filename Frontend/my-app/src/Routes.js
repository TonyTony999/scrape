import React from "react"
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Register from "./Pages/Register/register"
import Login from "./Pages/Login/index"
import DashBoard from "./Pages/Dashboard";
import singleCar from "./Pages/SingleCar/singleCar"
import myAccount from "./Pages/Account";
import misFavoritos from "./Pages/Favoritos/misFavoritos"


export default function Routes() {

    return (

        <BrowserRouter>
            <Switch>
                <Route path="/register" exact component={Register} />
                <Route path="/login" exact component={Login} />
                <Route path="/dashboard/:marca?" exact component={DashBoard} />
                <Route path="/car/:car_id?" exact component={singleCar} />
                <Route path="/my-account" exact component={myAccount}/>
                <Route path="/favourites" exact component={misFavoritos}/>

            </Switch>
        </BrowserRouter>

    )

}


