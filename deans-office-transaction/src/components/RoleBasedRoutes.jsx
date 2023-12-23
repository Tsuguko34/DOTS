import { useEffect } from "react";
import { Outlet, Navigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const RoleBasedRoutes = ({children}) => {
    const { user } = UserAuth()
    const { users } = UserAuth()

    if(users.find(item => item.UID === user.uid)?.role === "Faculty"){
        return <Navigate to={'/pages/Dashboard'}/>
    }
    

    return children
}

export default RoleBasedRoutes