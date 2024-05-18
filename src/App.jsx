import { useState } from 'react'
import './App.css'
import  Home  from "./Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login'


function App() {

  return (
    <div className='grid-container'>
    <Router>
      <Routes>
        <Route path="Login" element={<Login />} />
        <Route path="" element={<Home />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
