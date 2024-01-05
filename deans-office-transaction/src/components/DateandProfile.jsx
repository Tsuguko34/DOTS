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
  CssBaseline, 
  Typography,
  Badge,
  Box
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
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

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

  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const handleOpenMenu = (event) => {
    setAnchorElNotif(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElNotif(null);
  };

  const handleNotificationClick = () => {
    navigate('/pages/PendingLetters')
    handleCloseMenu();
  };

  const [notif, setNotif] = useState([])
  useEffect(() => {
    const fetchDataInterval = setInterval( async() => {
        try{
            const data = await axios.get(`${port}/getRequests`)
            const notifData = await axios.get(`${port}/getNotifs?userID=${user.uID}`)
            const notifArr = []
            data.data.forEach((doc) => {
              const forward = doc.forward_To
              const role = user.role
              // if((forward.includes(role) || forward.includes("All")) && !forward.includes(user.uID)){
              //     if(notifData.data.find(item => item.userUID == user.uID && item.docID == doc.uID && item.multiple == 1)?.isRead == 0 && notifData.data.find(item => item.userUID == user.uID && item.docID == doc.uID && item.multiple == 1)?.reminder != 1){
              //         AllArr.push(doc)
              //         if(doc.Status === "Pending"){
              //             pendingArr.push(doc)
              //         }
              //         else if(doc.Status === "Completed"){
              //             console.log(true);
              //             approvedArr.push(doc)
              //         }
              //         else if(doc.Status === "Rejected" || doc.Status === "Cancelled"){
              //             rejectedArr.push(doc)
              //         }
              //     }
              // }
              // else if(forward == user.uID){
              //     if(notifData.data.find(item => item.userUID == user.uID && item.docID == doc.uID && item.multiple == 0)?.isRead == 0 && notifData.data.find(item => item.userUID == user.uID && item.docID == doc.uID && item.multiple == 1)?.reminder != 1){
              //         AllArr.push(doc)
              //         if(doc.Status === "Pending"){
              //             pendingArr.push(doc)
              //         }
              //         else if(doc.Status === "Completed"){
              //             approvedArr.push(doc)
              //         }
              //         else if(doc.Status === "Rejected" || doc.Status === "Cancelled"){
              //             rejectedArr.push(doc)
              //         }
              //     }
              //     else if(doc.unread == 1){
              //         AllArr.push(doc)
              //         if(doc.Status === "Pending"){
              //             pendingArr.push(doc)
              //         }
              //         else if(doc.Status === "Completed"){
              //             approvedArr.push(doc)
              //         }
              //         else if(doc.Status === "Rejected" || doc.Status === "Cancelled"){
              //             rejectedArr.push(doc)
              //         }
              //     }
              // }
              if(doc.Status == "Pending"){
                if(forward == user.uID){
                  if(notifData.data.find(item => item.userUID == user.uID && item.docID == doc.uID && item.multiple == 0)?.isRead == 0 && notifData.data.find(item => item.userUID == user.uID && item.docID == doc.uID && item.multiple == 0)?.reminder == 1){
                    notifArr.push(doc)
                  }
                }
              }
            })
            setNotif(notifArr)
        }catch(e){
          console.log(e.message);
        }
      }, 1000);
      return () => {
        clearInterval(fetchDataInterval);
      };
    }, [user])
  

  return (
    <>
      <div className="date-time"  style={{marginTop: windowWidth <= 375 && "7vh"}}>
        <p>{date}</p>
        <Box component={"div"}  sx={{margin: "0px 10px"}}>
          <IconButton onClick={handleOpenMenu}>
            <Badge badgeContent={"content"} color="error" variant="dot" invisible={notif.length == 0}>
              <NotificationsActiveIcon color="action"/>
            </Badge>
          </IconButton>
        </Box>
        <Menu
        anchorEl={anchorElNotif}
        open={Boolean(anchorElNotif)}
        onClose={handleCloseMenu}
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
       
        >
          
          {notif.length > 0 ? notif.map((notif) => {
            return(
                <MenuItem onClick={handleNotificationClick}  sx={{minWidth: "250px", maxWidth: "300px"}}>
                  <Box component={"div"} sx={{display: "flex", justifyContent: "start", alignItems: "center"}}>
                    <RadioButtonCheckedIcon className="dialog-radio" sx={{marginRight: "5px"}}/>
                    <Box component={"div"} sx={{display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center"}}>
                      
                        <Typography sx={{maxWidth: "300px"}}>
                          <Typography sx={{fontWeight: "bold"}}>{notif.document_Name}</Typography> pending for the last 3 days.
                        </Typography>
                      
                    </Box>
                  </Box>
                </MenuItem>
            )
          }): (
            <MenuItem>
              No new notification.
            </MenuItem>
          )}
          
        </Menu>
        <Typography component={"div"} sx={{fontWeight: "bold", color: "#FF7F50"}}>{user.role}</Typography>
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
