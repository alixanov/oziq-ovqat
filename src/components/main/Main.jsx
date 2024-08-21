import React from 'react'
import "./main.css"
import { Route, Routes } from 'react-router-dom'
import { Card, Login, Sidebar, Storage } from '../'
import Seller from '../seller/Seller'


const Main = () => {
  return (
    <div className='main'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/card' element={<Card />} />
        <Route path='/seller' element={<Seller />} />
        <Route path='/storage' element={<Storage/>}/>
      </Routes>
    </div>
  )
}

export default Main
