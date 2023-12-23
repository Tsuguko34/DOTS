import { useEffect } from "react";
import { Outlet, Navigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const SettingsRoute = ({children}) => {
    const {user} = UserAuth()
    const { users } = UserAuth()

    if(!user){
        return <Navigate to={'/pages/Login'}/>
    }
    

    return children
}

export default SettingsRoute