import React, { useState } from "react"
import api from "../../services/api";
import { Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';

export default function Login({ history }) {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await api.post("/login", { email, password })
    console.log(response)
    if (response.data) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user_id", response.data.id)
      history.push("/dashboard")
    }


  }


  return (
    <>
      <div className="container1">
        <h1 style={{ textAlign: "center" }}>REVENTA CARROS </h1>
        <div className="secondary-container">
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="email" className="mr-sm-2">Correo</Label>
              <Input type="email" name="email" id="email" placeholder="Tu Correo" onChange={(event) => setEmail(event.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="password" className="mr-sm-2">Contraseña</Label>
              <Input type="password" name="password" id="password" placeholder="Tu Contraseña" onChange={(event) => setPassword(event.target.value)} />
            </FormGroup>
            <div className="button-container">
              <Button className="submit-btn">Acceder</Button>
            </div>
          </Form>

        </div>
      </div>
    </>




  )


}