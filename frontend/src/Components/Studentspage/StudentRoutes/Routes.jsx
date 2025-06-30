import {  Routes, Route } from "react-router-dom";
import Login from "../Dashboard/login"
import Dashboard from "../Dashboard/Dashboard";


function StudentRoute(){
    return (

            <Routes>
                <Route path="Home" element={<Home />} />
            </Routes>

    );
}

export default LoginRoute;