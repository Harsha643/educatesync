import React from 'react'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./landing.css"

const Landing = () => {
  return (
    <>
   <div className="mainnav">
   <div className='nav-left'>
   <img src="/logo.png" alt="logo"  width={"100px"} />
        </div>
      <div className="navcontainter">
      <ul className="nav justify-content-end">
      <li className="nav-item">
        <a className="nav-link active" aria-current="page" href="#">Home</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Features</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Courses</a>
      </li>
      <li className="nav-item">
      <a className="nav-link active" aria-current="page" href="#">Contact</a>
      </li>
      <li className="nav-item">
      <a className="nav-link active" aria-current="page" href="#">Login</a>
      </li>
    </ul>
    
      </div>
   </div>
      

    </>
  )
}

export default Landing
