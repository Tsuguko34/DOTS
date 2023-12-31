import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const RoleBasedRoutes = ({children}) => {
    const port = "http://localhost:3001"
    axios.defaults.withCredentials = true
    const [user, setUser] = useState([]);
    useEffect(() => {
        const getUser = async() => {
        try{
            await axios.get(`${port}/getUser`).then((data) => {
            setUser(data.data[0])
            })
        }catch(e){
            console.log(e);
        }
        }
        getUser()
    }, []);

    if(user.role === "Faculty"){
        return <Navigate to={'/pages/Dashboard'}/>
    }
    

    return children
}

export default RoleBasedRoutes