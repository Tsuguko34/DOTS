import { useEffect } from "react";
import { Outlet, Navigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";


const PrivateRoute = ({children}) => {
    const port = "http://localhost:3001"
    axios.defaults.withCredentials = true
    useEffect(() => {
        const getToken = async() =>{
            await axios.get(`${port}/getUser`).then((data) => {
                if(data.status == 401){
                    return <Navigate to={'/pages/Login'}/>
                }
            }).catch(()=> {
                return <Navigate to={'/pages/Login'}/>
            })
        }
        getToken()
    }, []);

    return children
}

export default PrivateRoute