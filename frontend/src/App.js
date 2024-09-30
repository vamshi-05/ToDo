import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./routes/PrivateRoute"
import AdminPrivateRoute from "./routes/AdminPrivateRoute"
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      
        <Route element={<PrivateRoute />}>
          
          <Route element={<AdminPrivateRoute />}>
            <Route path="/adminhome" element={<AdminHome />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
