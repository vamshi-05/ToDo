
import { useNavigate,Outlet } from "react-router-dom"
function PrivateRoute(){
    const navigate=useNavigate()

    const token=localStorage.getItem("token")
    console.log(token)
    if(!token || token===""){
        alert("Not authorized")
        navigate("/login")
        return ;
    }
    else{
        return <Outlet/>
    }
}

export default PrivateRoute