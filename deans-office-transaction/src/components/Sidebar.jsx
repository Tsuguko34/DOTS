import React, {useEffect, useState} from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import {Link, NavLink, useNavigate} from "react-router-dom";
import './Sidebar.css';
import logo from '../Images/cict-logo.png';
import { AiFillFund } from "react-icons/ai";
import { UserAuth } from './AuthContext';
import pimentel from "../Images/pimentel.png"
import CloseIcon from '@mui/icons-material/Close';
import { Badge, Chip, Collapse, Divider, Drawer, Fade, Grow, List, ListItem, ListItemButton, Menu, MenuItem, MenuList, Paper, Popper, SwipeableDrawer } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { useTypewriter, Cursor, Typewriter } from 'react-simple-typewriter';
import SendIcon from '@mui/icons-material/Send';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Overlay from '../pages/Overlay';
import axios from 'axios';
function Sidebar() {
    const port = "http://localhost:3001"
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

    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => {
        if(windowWidth <= 1024){
            setSidebar(!sidebar);
        }
    }

    useEffect(()=> {
        if(windowWidth > 1024){
            setSidebar(false)
        }
    }, [windowWidth])

    useEffect(()=> {
       if(sidebar){
        document.body.style.overflow = 'hidden'
       }else{
        document.body.style.overflow = 'auto'
       }
    }, [sidebar])
    const [monitoring, setMonitoring] = useState(false);
    const showMonitoring = () => setMonitoring(!monitoring);
    const [communications, setCommunications] = useState(false);
    const showCommunications = () => setCommunications(!communications);
    const [memorandums, setMemorandums] = useState(false);
    const showMemorandums = () => setMemorandums(!memorandums);
    const [requests, setRequests] = useState(false);
    const showRequests = () => setRequests(!requests);
    const [others, setOthers] = useState(false);
    const showOthers = () => setOthers(!others);
    const [typing, setTyping] = useState(true)
    const [allNotif, setAllNotif] = useState(0);
    const [pendingNotif, setPendingNotif] = useState(0);
    const [approvedNotif, setApprovedNotif] = useState(0);
    const [rejectedNotif, setRejectedNotif] = useState(0);
    const [users, setUsers] = useState([]);
    const [subArrayCol, setSubArrayCol] = useState([])
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async(authObj) => {
          unsub();
          if (authObj) {
            const userq = query(collection(db, "Users"))
            const userData = await getDocs(userq)
            setUsers(userData.docs.map((doc) => ({...doc.data(), id: doc.id})))
            
          }
        });
      }, []);


      useEffect(() => {
        const fetchDataInterval = setInterval( async() => {
            try{
                const data = await axios.get(`${port}/getRequests`)
                const notifData = await axios.get(`${port}/getNotifs?userID=${auth.currentUser.uid}`)
                const AllArr = []
                const pendingArr = []
                const approvedArr = []
                const rejectedArr = []
                data.data.forEach((doc) => {
                const forward = doc.forward_To
                const role = users.find(item => item.UID == auth.currentUser.uid)?.role
                if((forward.includes(role) || forward.includes("All")) && !forward.includes(auth.currentUser.uid)){
                    if(notifData.data.find(item => item.userUID == auth.currentUser.uid && item.docID == doc.uID && item.multiple == 1)?.isRead == 0){
                        AllArr.push(doc)
                        if(doc.Status === "Pending"){
                            pendingArr.push(doc)
                        }
                        else if(doc.Status === "Completed"){
                            console.log(true);
                            approvedArr.push(doc)
                        }
                        else if(doc.Status === "Rejected" || doc.Status === "Cancelled"){
                            rejectedArr.push(doc)
                        }
                    }
                }
                else if(forward == auth.currentUser.uid){
                    if(notifData.data.find(item => item.userUID == auth.currentUser.uid && item.docID == doc.uID && item.multiple == 0)?.isRead == 0){
                        AllArr.push(doc)
                        if(doc.Status === "Pending"){
                            pendingArr.push(doc)
                        }
                        else if(doc.Status === "Completed"){
                            approvedArr.push(doc)
                        }
                        else if(doc.Status === "Rejected" || doc.Status === "Cancelled"){
                            rejectedArr.push(doc)
                        }
                    }
                    else if(doc.unread == 1){
                        AllArr.push(doc)
                        if(doc.Status === "Pending"){
                            pendingArr.push(doc)
                        }
                        else if(doc.Status === "Completed"){
                            approvedArr.push(doc)
                        }
                        else if(doc.Status === "Rejected" || doc.Status === "Cancelled"){
                            rejectedArr.push(doc)
                        }
                    }
                }
                setAllNotif(AllArr.length)
                setPendingNotif(pendingArr.length)
                setApprovedNotif(approvedArr.length)
                setRejectedNotif(rejectedArr.length)
                })
            }catch(e){
              console.log(e.message);
            }
          }, 1000);
          return () => {
            clearInterval(fetchDataInterval);
          };
      }, [users])

      
  return (
    <>
    { auth.currentUser != undefined && users.find(item => item.UID === auth.currentUser.uid)?.passChanged !== false && (<>
        <div className="sidebar">
            <div className='toggle-sidebar'>
                <Link to="#" className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} className='toggle-color'/>
                </Link>
            </div>
        </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <List className='nav-menu-items'>
                    <ListItem disablePadding className="navbar-toggle" onClick={showSidebar}>
                        <Link to="#" className='menu-bars'>
                            <CloseIcon sx={{fill: "#FFF", width: 40, height: 40}}/>
                        </Link>
                    </ListItem>
                    <div className="container">
                        <div className="image-container">
                            <div className="img"></div>
                        </div>
                        <div className="curved-div">
                            <p>
                            <Typewriter words={['College of Information and Communications Technology']} typeSpeed={40}/>
                            {typing ? <Cursor cursorColor='#FF6347' cursorStyle = "|"/>: "" }
                            </p>
                        </div>
                    </div>
                    <ListItem sx={{mt: "5vh"}} disablePadding className='nav-text' onClick={showSidebar}>
                            <NavLink to='/pages/Dashboard' className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                <DashboardIcon size={'25px'}/>
                                <span>Dashboard</span>
                            </NavLink>
                    </ListItem>
                    <ListItem disablePadding className='nav-text' onClick={showRequests} end>
                        <div className='nav-monitoring'>
                            <DescriptionIcon size={'25px'}/>
                            <span>Requests</span>
                            <MdIcons.MdKeyboardArrowLeft size={'25px'} className={requests ? 'monitoring-arrow active' : 'monitoring-arrow'}/>
                            <div className='nav-notification'>
                                {allNotif != 0 ? 
                                (<Badge badgeContent={allNotif} color="error">
                                    <NotificationsActiveIcon color="action" />
                                </Badge>) : ''
                                }
                                
                            </div>
                        </div>
                        
                    </ListItem>
                    <Collapse in={requests} timeout="auto" unmountOnExit className='collapse-monitoring'>
                            <div className="monitoring-abholder">
                                <ListItem disablePadding className={'nav-letter'} onClick={showSidebar}>
                                    <NavLink to={"./Pages/PendingLetters"} className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                        <span>Pending</span>
                                        {pendingNotif != 0 ? (<span className='nav-notif'>{pendingNotif}</span>) : ''}
                                    </NavLink>
                                </ListItem>
                                
                            </div>
                            <div className="monitoring-abholder">
                                <ListItem disablePadding className={'nav-letter'} onClick={showSidebar}>
                                    <NavLink to={"./Pages/ApprovedLetters"} className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                        <span>Approved</span>
                                        {approvedNotif != 0 ? (<span className='nav-notif'>{approvedNotif}</span>) : ''}
                                    </NavLink>
                                </ListItem>
                            </div>
                            <div className="monitoring-abholder">
                                <ListItem disablePadding className={'nav-letter'} onClick={showSidebar}>
                                    <NavLink to={"./Pages/RejectedLetters"} className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                        <span>Rejected</span>
                                        {rejectedNotif != 0 ? (<span className='nav-notif'>{rejectedNotif}</span>) : ''}
                                    </NavLink>
                                </ListItem>
                            </div>
                            <div className="monitoring-abholder">
                                <ListItem disablePadding className={'nav-letter'} onClick={showSidebar}>
                                    <NavLink to={"./Pages/RequestHistory"} className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                        <span>Request History</span>
                                    </NavLink>
                                </ListItem>
                            </div>
                    </Collapse>
                    { auth.currentUser != undefined && users.find(item => item.UID === auth.currentUser.uid)?.role !== "Faculty" && (
                        <>
                            <ListItem disablePadding className='nav-text' onClick={showMonitoring} end>
                                <div className='nav-monitoring'>
                                    <TableRowsIcon size={'25px'}/>
                                    <span>Monitoring</span>
                                    <MdIcons.MdKeyboardArrowLeft size={'25px'} className={monitoring ? 'monitoring-arrow active' : 'monitoring-arrow'}/>
                                </div>
                            </ListItem>
                            <Collapse in={monitoring} timeout="auto" unmountOnExit className='collapse-monitoring'>
                                    <div className="monitoring-abholder">
                                        <ListItem disablePadding className={'nav-letter'} >
                                            <NavLink onClick={showCommunications}>
                                                <span>Communications</span>
                                                <MdIcons.MdKeyboardArrowLeft size={'25px'} className={communications ? 'monitoring-arrow active' : 'monitoring-arrow'}/>
                                            </NavLink>
                                        </ListItem>
                                        <Collapse  in={communications} timeout="auto" className='collapse-monitoring2' unmountOnExit>
                                            <div className="coms-menu">
                                                <ListItem disablePadding className={'nav-letter-menu'} onClick={showSidebar}>
                                                    <NavLink to="./pages/Incoming" className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                                        <span>Incoming Letters</span>
                                                        
                                                    </NavLink>
                                                </ListItem>
                                                <ListItem disablePadding className={'nav-letter-menu'} onClick={showSidebar}>
                                                    <NavLink to="./pages/Outgoing" className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                                        <span>Outgoing Letters</span>
                                                    </NavLink>
                                                </ListItem>   
                                            </div>
                                        </Collapse>
                                        <ListItem disablePadding className={'nav-letter'} >
                                            <NavLink onClick={showMemorandums}>
                                                <span>Memorandums</span>
                                                <MdIcons.MdKeyboardArrowLeft size={'25px'} className={memorandums ? 'monitoring-arrow active' : 'monitoring-arrow'}/>
                                            </NavLink>
                                        </ListItem>
                                        <Collapse  in={memorandums} timeout="auto" className='collapse-monitoring2' unmountOnExit>
                                            <div className="coms-menu">
                                                <ListItem disablePadding className={'nav-letter-menu'} onClick={showSidebar}>
                                                    <NavLink to="./pages/IncomingMemo" className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                                        <span>Incoming Memos</span>
                                                        
                                                    </NavLink>
                                                </ListItem>
                                                <ListItem disablePadding className={'nav-letter-menu'} onClick={showSidebar}>
                                                    <NavLink to="./pages/OutgoingMemo" className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                                        <span>Outgoing Memos</span>
                                                    </NavLink>
                                                </ListItem>   
                                            </div>
                                        </Collapse>
                                        <ListItem disablePadding className={'nav-letter'} >
                                            <NavLink to={"./pages/OtherDocuments"} className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                                                <span>Other Documents</span>
                                            </NavLink>
                                        </ListItem>
                                    </div>
                            </Collapse>
                        </>
                    )}
                    
                    <ListItem disablePadding className='nav-text' onClick={showSidebar}>
                        <NavLink to="./pages/Archives" className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                            <FaIcons.FaArchive size={'25px'}/>
                            <span>Archives</span>
                        </NavLink>
                    </ListItem>
                    <ListItem disablePadding className='nav-text' onClick={showSidebar} sx={{paddingBottom: "5vh"}}>
                        <NavLink to="./pages/Templates" className={({isActive}) => isActive ? 'nav-isActive' : ''} style={({isActive}) =>{return{color: isActive ? "#FFFFFF" : "",}}}>
                            <AiIcons.AiFillFolderOpen size={'25px'}/>
                            <span>Templates</span>
                        </NavLink>
                    </ListItem>
                </List>
            </nav>
            {sidebar && (
                <Overlay onClose={showSidebar} />
            )}
        </>)
        }
    </>
  )
}


export default Sidebar