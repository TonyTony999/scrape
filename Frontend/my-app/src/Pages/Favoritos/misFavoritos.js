import React, { Component } from "react"
import api from "../../services/api";
import "./index.css"

class misFavoritos extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      misFavoritos: [],
      misFavoritosResponse:[]
    }
    this.getUser = this.getUser.bind(this)
    this.delete_favorites = this.delete_favorites.bind(this)
    this.handleClick = this.handleClick.bind(this)
   // this.getFavoritos=this.getFavoritos.bind(this)
  }

  async getUser() {
    let user_id = localStorage.getItem("user_id")
   await api.get("/user", { headers: { user_id } }).then(async res=>{
      if (res.data.length !== 0) {
        this.setState({ user: res.data[0] })
        this.setState({ misFavoritos: res.data[0].myFavourites })  
      
      }
    })
     

  }

  async getFavoritos(favoritos){
   await api.get("/getFavoritos",{headers:{favoritos}}).then(res=>{
     
     this.setState({misFavoritosResponse:res.data })
     console.log("misFavoritosResponse: ", this.state.misFavoritosResponse)
   })
    
  }

  async handleClick(event) {

    let id=localStorage.getItem("user_id")
    const event_=event.target.id
    event.stopImmediatePropagation()
    if (event_ === "delete") {
      console.log(event.target.id)
      await this.delete_favorites()
    }
    else if(event_.match(/eliminar_/)){
     let index_of_id=event_.indexOf("_")+1
     let favorito_id=event_.slice(index_of_id,event_.length)
     let favoritos=this.state.misFavoritos.slice(0)
     let favoritos_response=this.state.misFavoritosResponse.slice(0)

     console.log("delete: ", favorito_id)
   
     let removed=favoritos.indexOf(favorito_id)
    
     if(removed!==-1){
      favoritos.splice(removed,1)  //REMOVE FAVORITE ID FROM THIS.STATE.MISFAVORITOS
      let new_favoritos= Object.assign([],favoritos)
      this.setState({misFavoritos:new_favoritos})

      favoritos_response=favoritos_response.filter(element=>{
       return element[0]._id!==favorito_id
      })
      let new_favoritos_response= Object.assign([],favoritos_response)
      this.setState({misFavoritosResponse:new_favoritos_response})

      console.log("mis favoritooos ", this.state.misFavoritos)
      console.log("mis favoritooos response ",this.state.misFavoritosResponse)
      favoritos=this.state.misFavoritos
      await api.post("/favoritesUpdate",{favoritos,id})

     }
    

    }
    
  }

  async delete_favorites() {

    let user_id = localStorage.getItem("user_id")
    await api.post("/favoritesDelete", {user_id}).then(response => {
      console.log(response)
    }).catch(err=>console.log(err))

  }

  componentDidMount() {
    this.getUser().then(res=>{
      this.getFavoritos(JSON.stringify(this.state.misFavoritos))
    })
  }

  render() {
    document.addEventListener("click",async (event) => this.handleClick(event))
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
                <a id="favoritos" href="http://localhost:3000/favourites">Mis Favoritos</a>
              </div>
            </div>
          </div>
          
          <div id="favorites_container">
          <div id="table_favorites">
            <h5 className="favorites_individual_content">MARCA</h5>
            <h5 className="favorites_individual_content">AÑO</h5>
            <h5 className="favorites_individual_content">PRECIO</h5>
            <h5 className="favorites_individual_content">KILOMETRAJE</h5>
            <h5 className="favorites_individual_content">DIFERENCIA PRECIO COMERCIAL</h5>

          </div>
            {
               this.state.misFavoritosResponse.length!==0?this.state.misFavoritosResponse.map((element,index)=>{  
                if(element.entries().length!==0){
                  return( 
                      
                  
                     <div className="favorites_individual" key={`favorites_${index}`}>
                      <div className="favorite_element" id="favorite_img_container">  
                      <a href={`http://localhost:3000/car/${element[0]._id}`} target="_blank">
                        <img src={element[0].img}></img> </a> </div>
                      <div className="favorite_element">{element[0].marca.toUpperCase()}</div>
                      <div className="favorite_element">{element[0].year}</div>
                      <div className="favorite_element">${element[0].price}</div>
                      <div className="favorite_element">{element[0].kilometraje[0]}</div>
                      {element[0].minPriceDif.toString().match(/"-"/)?<div className="favorite_element" id="negative">{element[0].minPriceDif}</div> :
                      <div className="favorite_element" id="positive">{element[0].minPriceDif}</div> }
                      <button className ="eliminar_button" id={`eliminar_${element[0]._id}`}>eliminar</button>

                    </div>
                   
                   
                  )
                }
                   
               }):<h2 style={{textAlign:"center", marginTop:"30%" , marginBottom:"30%"}}>CARGANDO</h2>
            }

          </div>

          <button id="delete" style={{marginBottom:"5%",marginTop:"5%"}}>Eliminar Favoritos</button>
   
        </div>
      </>

    )
  }

}

export default misFavoritos