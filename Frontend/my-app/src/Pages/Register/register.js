import React, { useState } from "react"
import api from "../../services/api";
import { Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import "./index.css"



export default function Register() {


  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [registered, setRegistered] = useState(false)



  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await api.post("/register", { firstName, lastName, email, password })
    
    setRegistered(true)
    setTimeout(() => {
      setRegistered(false)
    }, 2000)
    console.log(response)

  }


  return (
    <>
      <div className="container1">
        <h1 style={{ textAlign: "center" }}>REVENTA CARROS </h1>
        <div className="secondary-container">
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="firstName" className="mr-sm-2">Nombre</Label>
              <Input type="text" name="firstName" id="firstName" placeholder="Tu Nombre" onChange={(event) => setFirstName(event.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="lastName" className="mr-sm-2">Apellido</Label>
              <Input type="text" name="lastName" id="lastName" placeholder="Tu Apellido" onChange={(event) => setLastName(event.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="email" className="mr-sm-2">Correo</Label>
              <Input type="email" name="email" id="email" placeholder="Tu Correo" onChange={(event) => setEmail(event.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="password" className="mr-sm-2">Contraseña</Label>
              <Input type="password" name="password" id="password" placeholder="Tu Contraseña" onChange={(event) => setPassword(event.target.value)} />
            </FormGroup>
            <div className="button-container">
              <Button className="submit-btn">Registrarse</Button>
            </div>
          </Form>
          {registered ? (
            <Alert color="danger">
              New User Created
            </Alert>
          ) : ""}
        </div>
      </div>
    </>

  );
}


