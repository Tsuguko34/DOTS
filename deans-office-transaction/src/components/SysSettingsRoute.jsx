import { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const SysSettingsRoute = ({children}) => {
    const port = "http://localhost:3001"
    axios.defaults.withCredentials = true
    const [user, setUser] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const getUser = async() => {
        try{
            await axios.get(`${port}/getUser`).then((data) => {
                if(data.data[0].role != "Secretary" && data.data[0].role != "Dean"){
                    return navigate('/pages/Dashboard')
                }else{
                    return children
                }
            })
        }catch(e){
            console.log(e);
        }
        }
        getUser()
    }, []);
    return children
}

export default SysSettingsRoute