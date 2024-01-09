import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SettingsRoute = ({children}) => {
    const navigate = useNavigate()
    const port = "http://localhost:3001"
    axios.defaults.withCredentials = true
    useEffect(() => {
        const getToken = async() =>{
            await axios.get(`${port}/getUser`).then(async (data) => {
                if(data.status == 401){
                    return navigate('/pages/Login')
                }
            }).catch(()=> {
                return navigate('/pages/Login')
            })
        }
        getToken()
    }, []);
    

    return children
}

export default SettingsRoute