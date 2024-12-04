import React from 'react'
import Dynamicform from './components/Dynamicform'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

const App = () => {
  return (
    <div className='mainCompo'>
      <Header/>
      <Dynamicform/>
      <Footer/>
    </div>
  )
}

export default App
