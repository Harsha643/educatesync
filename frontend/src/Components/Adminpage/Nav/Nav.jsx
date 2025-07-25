import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import "./nav.css"

const Nav = () => {
const baseUrl="https://educatesync.onrender.com" || "http://localhost:4000"

    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    navigate('/');
  };  
  
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
  
        const res = await fetch(`${baseUrl}/admin/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setAdmin(data.data);
          
        } else {
          setError(data.msg || 'Failed to load admin data');
        }
      };
  
      fetchProfile();
    }, []);
    console.log(admin);
  return (
   <>
   <div className="header">
   <img src="/logo.png" alt="logo" width={"100px"} />
    {admin ? (
      <div className='insidediv'>
        
      <nav className='logoutbtn' onClick={() =>handleLogout() }><img src="/logout.png" width={"70px"}/></nav>
        <img src={admin.image || "/profile.png"} alt="" width={"70px"} style={{borderRadius:"50%", height:"70px"}} />
        
      
      </div>

    ) : (
      <div className='insidediv'>
        <nav className='loginbtn'>Login</nav>
        <img src="/profile.png" alt="profile" width={"100px"} />
      </div>
    )}
    </div>
     
   </>
  )

  
  // return (
  //  <>
  //  <div className="header">
  //  <img src="/logo.png" alt="logo" width={"100px"} />
  //  <div className='insidediv'>
  //  <nav className='loginbtn'>Login</nav>
  //  <img src="/profile.png" alt="profile" width={"100px"} />
  //  </div>
  //   </div> 
  //  </>
  // )
}

export default Nav
