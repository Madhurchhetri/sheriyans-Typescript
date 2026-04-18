import React, { useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/CreateProduct'
// import GetSellerProduct from '../features/products/pages/GetSellerProduct'
import { useAuth } from '../features/auth/hook/useAuth'
import Dashboard from '../features/products/pages/Dashboard'
import Protected from '../features/auth/components/Protected'
import Home from '../features/products/pages/Home'
import ProductDEtail from '../features/products/pages/ProductDEtail'
import SellerProductDetails from '../features/products/pages/SellerProductDetails'

const App = () => {
  const { handleGetMe } = useAuth()

  // Restore user session from cookie on every page load / refresh
  useEffect(() => {
    handleGetMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetMe])

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/product/:productId' element={<ProductDEtail />} />

       
          <Route path='/seller/create-product' element={<Protected role='seller'><CreateProduct/></Protected>}/>
          <Route path='/seller/dashboard' element={<Protected role='seller'><Dashboard /></Protected>}/>
          <Route path='/seller/product/:productId' element={<Protected role='seller'><SellerProductDetails /></Protected>}/>
      </Routes>
    </>
  )
}

export default App