
import { useNavigate,Outlet } from "react-router-dom"
function AdminPrivateRoute(){
    const navigate=useNavigate()

    const role=localStorage.getItem("role")
    if(!role && role!=="admin"){
        
        navigate("/login")
        return ;
    }
    else{
        return <Outlet/>
    }
}

export default AdminPrivateRoute