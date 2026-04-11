import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<h1 className="text-black text-center mt-20">hello world</h1>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </> 
  )
}

export default App