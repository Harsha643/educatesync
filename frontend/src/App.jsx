
// import RoutesComponent from './Components/Adminpage/Routes/Routes';

// import LoginRoute from './Components/Studentspage/StudentRoutes/Routes';

// import StaffLoginRoute from './Components/StaftPage/StaffRoutes/LOginRoute';
import AdminLogin from './Components/AdminLogin/Admin';
import {Routes,Route} from "react-router-dom" 
import RoutesComponent from './Components/Adminpage/Routes/Routes';
import Dashboard from './Components/Studentspage/Dashboard/Dashboard';
import StaffDashboard from './Components/StaftPage/Dashboard/Dashboard';

function App() {
  

  return (
    
  

      <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/admin/*" element={<RoutesComponent />} />
            <Route path="/Student-Dashboard/*" element={<Dashboard />} />
            <Route path='/Staff-Dashboard' element={<StaffDashboard />} />
            
            
        </Routes >
        
      

      
  )
}

export default App


