import React from 'react';
import './App.css';
import Routes from "./Routes"
import { findByLabelText } from '@testing-library/react';
//import { Row } from 'reactstrap';

function App() {
  return (
    <div className="App" style={{display:"flex", flexDirection:"row", backgroundColor:"transparent", height:"auto", alignItems:"center",padding:"0px" }}>
    <Routes />
    </div>
  );
}

export default App;
