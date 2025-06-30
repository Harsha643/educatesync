import React from 'react'
import Nav from '../Nav/Nav'
import './main.css'
import Admin from '../Adminlanding/Admin'
// import Login from '../../Studentspage/Dashboard/login'
// import Dashboard from '../../Studentspage/Dashboard/Dashboard'

const Main1 = () => {
  return (
   <>
   <Nav />
  <div className='Admin-container'>
    <Admin />
  </div>
   
   </>
  )
}

export default Main1
