import { Logout, Loop, PersonAdd, Settings } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  CssBaseline 
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import userPic from "../Images/user.png";
import { auth, storage } from "../firebase";
import Swal from "sweetalert2";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "./AuthContext";
import PersonIcon from '@mui/icons-material/Person';
import { DarkMode } from "./Darkmode";
import { getDownloadURL, ref } from "firebase/storage";
import axios from "axios";

function DateandProfile() {
  const port = "http://localhost:3001"
  axios.defaults.withCredentials = true
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState([]);
  const [userHolder, setuserHolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleName, setGoogleName] = useState("")
  const [date, setDate] = useState("");
  const [loginWith, setLoginWith] = useState(true)
  const [profilePic, setProfilePic] = useState(userPic)
  useEffect(() => {
    setDate(dayjs().format("MMMM D, YYYY h:mm A").toString());
    setInterval(() => {
      setDate(dayjs().format("MMMM D, YYYY h:mm A").toString());
    }, 1000);
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };  
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async() => {
      try{
        await axios.get(`${port}/getUser`).then((data) => {
          setUser(data.data[0])
        })
        await axios.get(`${port}/getUsers`).then((data) => {
          setUsers(data.data)
        })
      }catch(e){
        console.log(e);
      }
    }
    getUser()
  }, []);
  const logout = async () => {
    handleClose()
    Swal.fire({
      text: "Logout?",
      confirmButtonColor: "#FF5600",
      showDenyButton: true,
      denyButtonColor: "#888",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        await axios.post(`${port}/logout`).then((data) => {
          const success = data.data
          console.log(success.success);
          if (success.success == true){
            navigate("/pages/Login");
          }
        })
      }
    });
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  

  return (
    <>
      <div className="date-time"  style={{marginTop: windowWidth <= 375 && "7vh"}}>
        <p>{date}</p>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml:windowWidth >=768 && 2, mr:windowWidth >=768 && "2vh" }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar src={user ? `${port}/profile_Pictures/${user.profilePic}` : profilePic} sx={{border: "1px solid #212121",width: 45, height: 45}}/>
          </IconButton>
        </Tooltip>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          className:"menu-drop",
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
         <PersonIcon/> &nbsp; {user.full_Name}
        </MenuItem>
        <MenuItem>
          <DarkMode/>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{p: 0}}>
          <NavLink to={"../pages/Settings"} style={{textDecoration: "none", display: "flex", alignItems:"center", width: "100%", height: "100%", padding: "6px 16px", }} className="menu-drop2">
            <Settings fontSize="small" sx={{mr: "1vh"}}/>
            Account Settings
          </NavLink>
        </MenuItem>
        <MenuItem onClick={logout}>
          <Logout fontSize="small" sx={{mr: "1vh"}}/>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default DateandProfile;
