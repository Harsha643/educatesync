import {Routes, Route} from "react-router-dom";
import Login from "../Dashboard/Login"

import StaffDashboard from "../Dashboard/Dashboard";


function StaffLoginRoute() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
        </Routes>
 
);
}

export default StaffLoginRoute;