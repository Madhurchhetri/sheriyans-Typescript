import React, { useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/CreateProduct'
import GetSellerProduct from '../features/products/pages/GetSellerProduct'
import { useAuth } from '../features/auth/hook/useAuth'

const App = () => {
  const { handleGetMe } = useAuth()

  // Restore user session from cookie on every page load / refresh
  useEffect(() => {
    handleGetMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Routes>
        <Route path='/' element={<h1 className="text-black text-center mt-20">hello world</h1>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/seller/create-product' element={<CreateProduct />} />
        <Route path='/seller/products' element={<GetSellerProduct />} />
      </Routes>
    </>
  )
}

export default App