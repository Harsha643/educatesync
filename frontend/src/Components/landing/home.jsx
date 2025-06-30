import React from 'react'
import "./home.css"
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import welcom from "../assets/welcom.png"




const Home = () => {
  return (
    <>
   <div className="container-1">
   <img src={welcom} width={"100%"}   alt="welcome " />
   </div>
    </>
  )
}

export default Home

