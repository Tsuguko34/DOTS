import { useEffect } from "react";
import { Outlet, Navigate } from "react-router"
import { auth } from "../firebase";
import { UserAuth } from "./AuthContext";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const PrivateRoute = ({children}) => {
    const {user} = UserAuth()
    const { users } = UserAuth()

    if(!user){
        return <Navigate to={'/pages/Login'}/>
    }else if(users.find(item => item.UID === user.uid)?.passChanged == false){
        return <Navigate to={'/pages/Settings'}/>
    }
    

    return children
}

export default PrivateRoute