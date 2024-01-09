import React, { useState, useEffect } from "react";
import "./Pages.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import cn from "../components/cn";
import dayjs from "dayjs";
import noresult from "../Images/noresults.png";
import userpic from "../Images/user.png";
import noresult2 from "../Images/noresult2.png";
import Calendar from "../components/Calendar";
import Welcome from '../Images/welcome2.png'
import LogsPic from '../Images/Logs.png'
import DeletePic from '../Images/delete.png'
import { auth, db, firestore, storage } from "../firebase";
import pdfIcon from '../Images/pdf.png'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  listAll,
  getMetadata,
} from "firebase/storage";
import { DatePicker, LocalizationProvider, yearCalendarClasses } from "@mui/x-date-pickers";
import DateandProfile from "../components/DateandProfile";
import { Box, Button, Card, CardContent, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, ImageList, ImageListItem, List, ListItem, ListItemIcon, ListItemText, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { DarkMode } from "../components/Darkmode";
import welcome from "../Images/welcome.png";
import { Logout, Settings } from "@mui/icons-material";
import { UserAuth } from "../components/AuthContext";
import Swal from "sweetalert2";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import InventoryIcon from '@mui/icons-material/Inventory';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PendingCharts from "../components/PendingCharts";
import { useTypewriter, Cursor, Typewriter } from 'react-simple-typewriter';
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import AccordionReport from "../components/Accordion";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import docxViewIcon from '../Images/docxView.png'
import xlsxViewIcon from '../Images/xlsxView.png'
import Lightbox from "react-image-lightbox";
import { CloudDownload } from "@mui/icons-material";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import axios from "axios";
import JSZip from "jszip";

ChartJS.register(ArcElement, Tooltip, Legend);
//sample comment hahaha

function Dashboard() {
  const port = "http://localhost:3001"
  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [others, setOthers] = useState(false)
  const showOthers = () => setOthers(!others);
  

  const dashboardCollectionRef = collection(db, "documents");
  const [loginWith, setLoginWith] = useState(true)
  const [travelOrderData, setTravelOrderData] = useState([])
  const [trainingData, setTrainingData] = useState([])
  const [leaveData, setLeaveData] = useState([])
  const [travelData, setTravelData] = useState([])
  const [fiveOffice, setFiveOffice] = useState([])
  const [officeData, setofficeData] = useState([])
  const [typeSets, setTypeSets] = useState([])
  const getChartData1 = async () => {
    
    const data = await axios.get(`${port}/requests`)
    setofficeData(data.data)
    const fromDepValues = data.data.filter(item => item.fromDep !== null).map(item => item.fromDep)
    const officeCount = fromDepValues.reduce((acc, fromDep) => {
      acc[fromDep] = (acc[fromDep] || 0) + 1;
      return acc;
    }, {});
    const sortedOffices = Object.keys(officeCount).sort((a, b) => officeCount[b] - officeCount[a]);
    const topFiveOffices = sortedOffices.slice(0, 5);
    setFiveOffice(topFiveOffices);


    data.data.forEach((doc) => {
      const docType = doc.document_Type
      const Type = doc.Type
      if(docType === "Faculty Document" && Type === "Application for Leave"){
        const existing = leaveData.findIndex((item) => item.name == doc.fromPer)
        if(existing !== -1){
          leaveData[existing].count += 1
        }else{
          leaveData.push({name: doc.fromPer, count: 1})
        }
      }
      else if(docType === "Faculty Document" && Type === "Training Request Form"){
        const existing = trainingData.findIndex((item) => item.name == doc.fromPer)
        if(existing !== -1){
          trainingData[existing].count += 1
        }else{
          trainingData.push({name: doc.fromPer, count: 1})
        }
      }
      else if(docType === "Travel Order"){
        const existing = travelOrderData.findIndex((item) => item.name == doc.fromPer)
        if(existing !== -1){
          travelOrderData[existing].count += 1
        }else{
          travelOrderData.push({name: doc.fromPer, count: 1})
        }
      }
    })

    const docTypeValues = data.data.filter(item => item.document_Type !== null).map(item => item.document_Type)
    const docTypeCount = docTypeValues.reduce((acc, document_Type) => {
      acc[document_Type] = (acc[document_Type] || 0) + 1;
      return acc;
    }, {});
    const sortedDocType = Object.keys(docTypeCount).sort((a, b) => docTypeCount[b] - docTypeCount[a]);
    const topSets = Array.from(sortedDocType).slice(0, 15);
    setTypeSets(topSets)
  };

  useEffect(() => {
    getChartData1();
  }, []);

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

  const option = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: windowWidth <= 576 ? false: true,
        position: windowWidth >= 1440 ?"right" : "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          responsive: true,
          fontSize: 16,
          pointStyle: "rectRounded",
          fontColor: "#888"
        },
      },
    },
  };

  const total_Data = {
    labels: typeSets,
    datasets: [
      {
        label: "Number of Documents",
        data: typeSets.map(item => officeData.filter(docs => docs.document_Type == item).length),
        backgroundColor: [
          "#FF6701",
          "#FEA82F",
          "#FFC288",
          "#FCECDD",
          "#D8F8B7",
          "#9FB8AD",
          "#6A9C89",
          "#E9B824",
          "#F5E8B7",
          "#F99417",
          "#FFB000",
          "#FFCC70",
          "#A1CCD1",
          "#CECE5A",
          "#FFD6A5"
        ],
        borderWidth: 0,
      },
    ],
  };

  const Baroption = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          responsive: true,
          fontSize: 16,
          pointStyle: "rectRounded",
          fontColor: "#888"
        },
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            maxRotation: -90,
            minRotation: -90,
          },
        },
      ],
    },
  };
  const bar_Data = {
    labels: fiveOffice,
    datasets: [
      {
        label: "Incoming",
        data: fiveOffice.map(office => officeData.filter(item => (item.fromDep == office && item.Remark == "Incoming")).length),
        backgroundColor: [
          "#FFC288",
        ],
        borderWidth: 0,
      },
      {
        label: "Outgoing",
        data: fiveOffice.map(office => officeData.filter(item =>  (item.fromDep == office && item.Remark == "Outgoing")).length),
        backgroundColor: [
          "#9FB8AD",
        ],
        borderWidth: 0,
      },
    ],
  };
  //FIREBASE-------------------------------------------------
  //INPUTS
  const [userHolder, setuserHolder] = useState(null);
  const [googleName, setGoogleName] = useState("")
  const [googleEmail, setGoogleEmail] = useState("")
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

  const [emptyResult, setEmptyResult] = useState(false);
  const [dashboard, setDashboard] = useState([]);
  const [yearMonth, setYearMonth] = useState([]);
  const [filteredDash, setFilteredDash] = useState([])
  
  const [userInfo, setUserInfo] = useState([]);
  const [archiveDoc, setarchiveDoc] = useState(0);
  let q = query(
    dashboardCollectionRef,
    where("date_Received", "==", dayjs().format("MM/DD/YYYY").toString())
  );
  let q2 = query(dashboardCollectionRef, orderBy("date_Received", "desc"));
  const getDashboard = async () => {
    const data = await axios.get(`${port}/requests`)
    setDashboard(data.data);
    
    if (data.data.length > 0) {
      setLoading(false);
      setEmptyResult(false)
    }else{
      setLoading(false);
      setEmptyResult(true)
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const [yearData, setYearData] = useState(0)
  const [monthData, setMonthData] = useState(0)
  const [dayData, setDayData] = useState(0)

  const getMonthYearData = async () => {
    const yearMonthData = await axios.get(`${port}/requests`)
    setYearMonth(yearMonthData.data);
    yearMonth.map((yearMonth) => {
      if (dayjs().isSame(yearMonth.date_Received, "year")) {
        if(user.role === "Faculty"){
          if(yearMonth.forward_To.includes("Faculty") || (yearMonth.forward_To.includes("All") && !yearMonth.forward_To.includes(user.uID)) ||  yearMonth.forward_To == user.uID  || yearMonth.forwarded_By == user.uID  || yearMonth.accepted_Rejected_By == user.uID ){
            setYearData(prev => prev + 1)
          }
        }else if(user.role !== "Faculty"){
          setYearData(prev => prev + 1)
        }
        
      }
      if (dayjs().isSame(yearMonth.date_Received, "month")) {
        if(user.role === "Faculty"){
          if(yearMonth.forward_To.includes("Faculty") || (yearMonth.forward_To.includes("All") && !yearMonth.forward_To.includes(user.uID)) ||  yearMonth.forward_To == user.uID  || yearMonth.forwarded_By == user.uID  || yearMonth.accepted_Rejected_By == user.uID ){
            setMonthData(prev => prev + 1)
          }
        }else if(user.role !== "Faculty"){
          setMonthData(prev => prev + 1)
        }
      }
      if (dayjs().isSame(yearMonth.date_Received, "day")) {
        if(user.role === "Faculty"){
          if(yearMonth.forward_To.includes("Faculty") || (yearMonth.forward_To.includes("All") && !yearMonth.forward_To.includes(user.uID)) || yearMonth.forward_To == user.uID  || yearMonth.forwarded_By == user.uID  || yearMonth.accepted_Rejected_By == user.uID ){
            setDayData(prev => prev + 1)
          }
        }else if(user.role !== "Faculty"){
          setDayData(prev => prev + 1)
        }
      }
    });

    const archiveDocs = await axios.get(`${port}/getArchives`)
    archiveDocs.data.forEach((doc) => {
      if(user.role === "Faculty"){
        if(doc.forward_To.includes("Faculty") || (doc.forward_To.includes("All") && !doc.forward_To.includes(user.uID)) ||  doc.forward_To == user.uID  || doc.forwarded_By == user.uID  || doc.accepted_Rejected_By == user.uID ){
          setarchiveDoc(prev => prev + 1)
          
        }
      }else if(user.role !== "Faculty"){
        console.log(user.role);
        setarchiveDoc(prev => prev + 1)
      }
    })
  };

  useEffect(() => {
    getMonthYearData();
  }, [dashboard]);



  const [userName, setuserName] = useState("");
  const [profilePic, setProfilePic] = useState(userpic)
  const getUserInfo = async () => {
    setLoginWith(!setLoginWith)
    if (!user.uID) return;
    setProfilePic(`${port}/profile_Pictures/${user.profilePic}`)
    setUserInfo(user);
    setuserName(user.full_Name)
  };

  

  const getSignInMethods = () => {
    if (userHolder) {
        getUserInfo()
        setuserName(user.full_Name)
        setGoogleEmail(user.email)
    }
  };

  useEffect(() => {
    getSignInMethods();
  }, [userHolder]);

  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(dayjs().format("MMMM D, YYYY").toString());
    setInterval(() => {
      setDate(dayjs().format("MMMM D, YYYY").toString());
    }, 1000);
  });

  const { signout } = UserAuth();
  const logout = async () => {
    Swal.fire({
      title: "Logout?",
      icon: "warning",
      confirmButtonColor: "#FF5600",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        await signout();
        navigate("/pages/Login");
      }
    });
  };

  const logcollectionRef = collection(db, "logs");
  const [logData, setLogData] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [openShowLogs, setOpenShowLogs] = useState(false);
  const [openShowDel, setOpenShowDel] = useState(false);
  const openLogs = () => {
    setOpenShowLogs(true);
    setLoading2(true);
    getLogs();
  };
  const closeLogs = () => {
    setOpenShowLogs(false);
    setLogData([]);
    setFilter10("")
    setFilter5("")
    setFilter6("")
  };

  const openDel = () => {
    setOpenShowDel(true);
  };
  const closeDel = () => {
    setOpenShowDel(false);

  };

  const [filter5, setFilter5] = useState(false);
  const [filter6, setFilter6] = useState(false);
  const [filter10, setFilter10] = useState("");
  const getLogs = async () => {
    const data = await axios.get(`${port}/getLogs`);
    const LogDataset = data.data.map((doc) => ({ ...doc, id: doc.uID, dateTime: new Date(doc.date) }));
    // Sort the data by year, month, day, and time in descending order
    LogDataset.sort((a, b) => {
      if (b.dateTime.getFullYear() !== a.dateTime.getFullYear()) {
        return b.dateTime.getFullYear() - a.dateTime.getFullYear();
      } else if (b.dateTime.getMonth() !== a.dateTime.getMonth()) {
        return b.dateTime.getMonth() - a.dateTime.getMonth();
      } else if (b.dateTime.getDate() !== a.dateTime.getDate()) {
        return b.dateTime.getDate() - a.dateTime.getDate();
      } else if (b.dateTime.getHours() !== a.dateTime.getHours()) {
        return b.dateTime.getHours() - a.dateTime.getHours();
      } else if (b.dateTime.getMinutes() !== a.dateTime.getMinutes()) {
        return b.dateTime.getMinutes() - a.dateTime.getMinutes();
      } else if (b.dateTime.getSeconds() !== a.dateTime.getSeconds()) {
        return b.dateTime.getSeconds() - a.dateTime.getSeconds();
      } else {
        return b.dateTime.getTime() - a.dateTime.getTime();
      }
    });
    setLogData(LogDataset)
    setLoading2(false);
  };

  //Table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const filterDashData = []
    dashboard.forEach((doc) => {
      const forward = doc.forward_To
      if(user && (forward.includes("All") ||  forward.includes(user.role) || forward == user.uID) && doc.date_Received == dayjs().format('MM/DD/YYYY')){
        console.log(doc);
        filterDashData.push(doc)
        setEmptyResult(false)
        setLoading(false)
      }
    });
    setFilteredDash(filterDashData)
    if (filterDashData.length == 0){
      
      setEmptyResult(true)
    }
  }, [dashboard])

  //Show File
  const [openShowFile, setOpenShowFile] = useState(false);
  const [displayFile, setDisplayFile] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [filePDF, setFilePDF] = useState([]);
  const [fileDocx, setFileDocx] = useState([]);
  const [fileXlsx, setFileXlsx] = useState([]);
  const [currentPDF, setCurrentPDF] = useState([])
  const [tabValue, setTabValue] = useState('1');
  const [loading3, setLoading3] = useState(true);
  const openFile = (id) => {
    setLoading3(true)
    setOpenShowFile(true);
    showFile(id);
  };
  const showFile = async (id) => {
    const imageListRef = await axios.get(`${port}/getFile?id=${id}`);
    const data = await axios.get(`${port}/openFile?id=${id}`);
    setDisplayFile(data.data);
    imageListRef.data.forEach((item) => {
        if(item.file_Name.includes('.png') || item.file_Name.includes('.jpg') || item.file_Name.includes('.jpeg')){
            setImageList((prev) => [...prev, item.file_Name]);
        }
        else if (item.file_Name.includes('.pdf')){
            setFilePDF((prev) => [...prev, item]);
        }
        else if (item.file_Name.includes('.docx') || item.file_Name.includes('.doc')){
            setFileDocx((prev) => [...prev, item]);
        }
        else if (item.file_Name.includes('.xlsx')){
            setFileXlsx((prev) => [...prev, item]);
        }
    });
    setLoading2(false);
   
  };

  const handlePDFChange = (event, newValue) => {
    setCurrentPDF(newValue);
  };
  useEffect(() => {
    setCurrentPDF(filePDF[0])
    console.log(currentPDF);
  }, [filePDF])

  useEffect(() => {
    setTabValue(imageList.length != 0 ? '1' : (imageList.length == 0 && filePDF.length != 0) ? '2' : (imageList.length == 0 && filePDF.length == 0 && fileDocx.length != 0) ? '3' : (imageList.length == 0 && filePDF.length == 0 && fileDocx.length == 0 && fileXlsx.length != 0) && '4')
    console.log(tabValue);
  }, [filePDF, imageList, fileDocx, fileXlsx])

  const closeFile = async () => {
    await setOpenShowFile(false);
    setLoading2(true);
    setDisplayFile([]);
    setImageList([]);
    setFilePDF([]);
    setFileDocx([]);
    setFileXlsx([]);
  };

   //LightBox
   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
   const [lightboxIndex, setLightboxIndex] = useState(0);
 
   const openLightbox = (index) => {
     setIsLightboxOpen(true);
     setLightboxIndex(index);
   };
 
   const closeLightbox = () => {
     setIsLightboxOpen(false);
   };
 
   //Tab Pannel
   const handleTabChange = (event, newValue) => {
     setTabValue(newValue);
   };
 
   const handleDownload = (type, name) => {
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    
      if (type === "docx" || type === "xlsx") {
        const fileName = name.substring(37)
        const fileURL = `${port}/document_Files/${name}`;
        fetch(fileURL)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => console.error('Error downloading file:', error));
      }
    else if(type == "image"){
      if(imageList.length > 1){
        const zip = new JSZip()
        const promises = imageList.map((image, index) => {
          const imageUrl = `${port}/document_Files/${image}`;
          const filename = image.substring(37);
  
          return fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => zip.file(filename, blob));
        });
  
        Promise.all(promises).then(() => {
          zip.generateAsync({ type: 'blob' }).then(blob => {
            const url = URL.createObjectURL(blob);
            anchor.href = url;
            anchor.download = `${displayFile[0].document_Name}.zip`;
  
            anchor.target = '_blank';
            anchor.click();
  
            URL.revokeObjectURL(url);
          });
        });
       
      }else{
        for(const image of imageList){
          const imageUrl = `${port}/document_Files/${image}`;
          fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
              const objectUrl = URL.createObjectURL(blob);
              anchor.href = objectUrl;
              anchor.download = image.substring(37);
              anchor.target = '_blank';
              anchor.click();
              URL.revokeObjectURL(objectUrl);
              console.log(true);
            })
            .catch(error => {
              console.error('Error fetching image:', error);
            });
        }
      }
    }
    document.body.removeChild(anchor);
};

   const newPlugin = defaultLayoutPlugin();
    const pagePlugin = pageNavigationPlugin();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <section className="dashboard">
        <div className="page-title">
          <p>Dean's Office Transaction Dashboard</p>
          <div className="page-desc">Dean's office transaction summary</div>
        </div>
        <Grid container xs={12} sx={{padding: "21.6px"}} gap={1} flexWrap={windowWidth > 1024 ? "noWrap" : ''} overflow={"hidden"}>
            <Grid item xs={12} sm={6} md={6} xl={4}>
              <Card className="dash-welcome" sx={{height: "100px",maxHeight: "100px"}}>
                <div className="welcome-holder">
                  <div className="welcome-img">
                    <img src={Welcome}/>
                  </div>
                  <div className="welcome-msg">
                      <Typography variant="h1" className="welcome-hello" sx={{fontSize:windowWidth <= 768 && windowWidth > 425 ? "1.3rem" :windowWidth < 425 ? "1rem" : "1.5rem", display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
                        Welcome, <Typography sx={{fontSize:windowWidth <= 768 && windowWidth > 425 ? "1.3rem" :windowWidth < 425 ? "1rem" : "1.5rem", color: "#E6E4F0", fontWeight: 'bold'}}> &nbsp;{user.role}</Typography>
                      </Typography>
                      <Typography variant="div" className="welcome-hello2" sx={{fontSize:windowWidth <= 768 && windowWidth > 425 ? "1.3rem" :windowWidth < 425 ? "1rem" : "1.5rem", fontWeight: 'bold'}}>
                        {user != undefined && user.full_Name}
                      </Typography>
                  </div>
                </div>    
              </Card>
            </Grid>
            <Grid item xs={12} sm={5.8} md={5.8} lg={2} xl={2} >
              <Card className="dash-totals" sx={{height: "100px",maxHeight: "100px"}}>
                <div className="dash-total">
                  <div className="dash-total-icon">
                    <InventoryIcon sx={{height: "45px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} />
                  </div>
                  <div className="dash-total-title">
                    <p>Archived Docs</p>
                    <h2>{archiveDoc}</h2>
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3.7} md={3.7} lg={2} xl={2}>
              <Card className="dash-totals" sx={{height: "100px",maxHeight: "100px"}}>
                <div className="dash-total">
                  <div className="dash-total-icon">
                    <TodayIcon sx={{height: "45px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} />
                  </div>
                  <div className="dash-total-title">
                    <p>Docs this day</p>
                    <h2 id="total2">{dayData}</h2>
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} sm={windowWidth <= 691 && windowWidth > 599? 3.9 : 4} md={4} lg={2} xl={2}>
              <Card className="dash-totals" sx={{height: "100px",maxHeight: "100px"}}>
                <div className="dash-total">
                  <div className="dash-total-icon">
                    <DateRangeIcon sx={{height: "45px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} />
                  </div>
                  <div className="dash-total-title">
                    <p>Docs this month</p>
                    <h2 id="total3">{monthData}</h2>
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={2}>
              <Card className="dash-totals" sx={{height: "100px",maxHeight: "100px"}}>
                <div className="dash-total">
                  <div className="dash-total-icon">
                    <CalendarMonthIcon sx={{height: "45px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} />
                  </div>
                  <div className="dash-total-title">
                    <p>Docs this year</p>
                    <h2 id="total4">{yearData}</h2>
                  </div>
                </div>
              </Card>
            </Grid>
        </Grid>
        <Grid container xs={12} sx={{pr: "21.6px", pl: "21.6px", pb: "21.6px", maxWidth: "800px"}} flexWrap={windowWidth >= 1440 ? "nowrap" : ''} overflow={"hidden"}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl= {6}>
          <Typography sx={{fontSize: "1.2rem", fontWeight: "bold"}} className="type-title"><Typewriter words={['Document Status']} typeSpeed={40}/></Typography>
            <Card sx={{height: "400px", maxHeight: "400px", maxWidth: "1000px", display:"flex", justifyContent: "center", alignItems: "center", p: "11.6px", mr: windowWidth >= 1024 ? '11.6px' : 0}} className="dash-cards">
              <PendingCharts />
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl= {6}>
            {user.role !== "Faculty" ? (<>
              <Typography sx={{fontSize: "1.2rem", fontWeight: "bold", ml: windowWidth >= 1024 ? '11.6px' : 0}} className="type-title"><Typewriter words={['Document Types']} typeSpeed={40}/></Typography>
              <Card sx={{height: "400px", maxHeight: "400px", maxWidth: "1000px", display:"flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: "21.6px", ml: windowWidth >= 1024 ? '11.6px' : 0}} className="dash-cards">
                  <div className="size" style={{width: "100%", maxWidth: "500px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Doughnut
                          data={total_Data}
                          options={option}
                        />
                  </div>
                  {windowWidth <= 576 && <Typography sx={{color: "#FF6347"}}>Document Types Distribution</Typography>}
              </Card>
              </>
            ) : (
              <>
              <Typography sx={{fontSize: "1.2rem", fontWeight: "bold"}} className="type-title"><Typewriter words={['Schedules']} typeSpeed={40}/></Typography>
              <Card sx={{height: windowWidth > 768 ? "400px" : "100%",maxHeight: "400px", display:"flex", justifyContent: "center", alignItems: "center", p:windowWidth > 768 ? "21.6px" : 0}} className="dash-cards">
                <iframe src="https://calendar.google.com/calendar/embed?src=carpio.johnjazpher.dc.3188%40gmail.com&ctz=Asia%2FManila" style={{border: 0}} width={windowWidth > 750 ?'550' : windowWidth > 375 ? '350' : windowWidth > 320 ? "300" : "250"} height="350" frameborder="0" scrolling="no"></iframe>
              </Card>
              </>
              
            )}
            
          </Grid>
        </Grid>
        {user.role !== "Faculty" && (
          <Grid container xs={12} sx={{pr: "21.6px", pl: "21.6px", pb: "21.6px"}} gap={2} flexWrap={windowWidth >= 1024 ? "noWrap" : ''} overflow={"hidden"}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl= {6}>
            <Typography sx={{fontSize: "1.2rem", fontWeight: "bold"}} className="type-title"><Typewriter words={['Documents per Office']} typeSpeed={40}/></Typography>
              <Card sx={{height: "470px", maxHeight: "470px", maxWidth: "1000px", display:"flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: "21.6px"}} className="dash-cards">
                  <div className="size" style={{width: "100%", maxWidth: "500px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Bar
                          data={bar_Data}
                          options={Baroption}
                          style={{width: "100%"}}
                        />
                  </div>
              </Card>
          </Grid>
          
          <Grid item xs={12} sm={12} md={6} lg={6} xl= {6}>
              <Grid container sx={12} gap={2} wrap="noWrap">
              <Grid item xs={12}>
                <Card sx={{width: '100%',height: "50px", display:"flex", justifyContent: "center", alignItems: "center", p: "21.6px", mb: "21.8px", maxHeight: '100px', userSelect: 'none'}} className="dash-gradient">
                {user != undefined && user.role === "Dean" && (
                  <div className="welcome-holder2" onClick={openLogs} style={{cursor: "pointer", userSelect: "none"}}>
                    <div className="logs-img">
                      <img src={LogsPic}/>
                    </div>
                    <div className="welcome-msg">
                        <Typography className="welcome-hello2" sx={{ml: "50px"}}>
                          <h1>Logs</h1>
                        </Typography>
                    </div>
                  </div>
                  )}
                </Card>            
              </Grid>         
              </Grid>
           
            <Typography sx={{fontSize: "1.2rem", fontWeight: "bold"}} className="type-title"><Typewriter words={['Schedules']} typeSpeed={40}/></Typography>
            <Grid item xs={12} sm={12}>
              <Card sx={{height: windowWidth > 768 ? "450px" : "500px",maxHeight: "400px", display:"flex", justifyContent: "center", alignItems: "center", p:windowWidth > 768 ? "21.6px" : 0}} className="dash-cards">
                <iframe src="https://calendar.google.com/calendar/embed?src=carpio.johnjazpher.dc.3188%40gmail.com&ctz=Asia%2FManila" style={{border: 0}} width={windowWidth > 750 ?'550' : windowWidth > 375 ? '350' : windowWidth > 320 ? "300" : "250"} height="350" frameborder="0" scrolling="no"></iframe>
              </Card>
            </Grid>
            </Grid>
        </Grid>
        )}
        {user.role === "Dean" && (
          <Grid container xs={12} sx={{pr: "21.6px", pl: "21.6px", pb: "21.6px"}} gap={2} flexWrap={windowWidth >= 1024 ? "noWrap" : ''} overflow={"hidden"}>
            <Grid item xs={12} sm={12} md={4} lg={4} >
              <Card sx={{width: "100%", height:"250px", p: '21.6px', maxHeight: '300px'}}>
                <Box sx={{borderBottom: "1px solid #F0EFF6"}}>
                  <Typography className="type-title" sx={{fontWeight: "700", fontSize: "1.1rem"}}>Faculty Travel Orders</Typography>
                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", mr: "54.7px", ml: "21.6px"}}>
                    <Typography sx={{fontWeight: "700", color: "#888"}}>Name</Typography>
                    <Typography sx={{fontWeight: "700", color: "#888"}}>Count</Typography>
                  </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: "column"}}>
                  {travelOrderData.slice(0,1).map((item) => {return(
                    <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", pr: "54.7px", pl: "21.6px", pt: "11.6px", pb: "11.6px", mt: "11.6px", bgcolor: '#fda072'}}>
                      <Typography sx={{fontWeight: "700", color: "#fff"}}>{item.name}</Typography>
                      <Typography sx={{fontWeight: "700", color: "#fff"}}>{item.count}</Typography>
                    </Card>
                  )})}
                  {travelOrderData.slice(1,3).map((item) => {return(
                    <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", pr: "54.7px", pl: "21.6px", mt: "11.6px", bgcolor: '#E6E4F0'}}>
                      <Typography sx={{fontWeight: "500", color: "#777"}}>{item.name}</Typography>
                      <Typography sx={{fontWeight: "500", color: "#777"}}>{item.count}</Typography>
                    </Card>
                  )})}
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} >
              <Card sx={{width: "100%", height:"250px", p: '21.6px', maxHeight: '300px' }}>
                <Box sx={{borderBottom: "1px solid #F0EFF6"}}>
                    <Typography className="type-title" sx={{fontWeight: "700", fontSize: "1.1rem"}}>Faculty Training</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", mr: windowWidth >= 1980 ? "21.6px": "5px", ml: "21.6px"}}>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Name</Typography>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Count</Typography>
                    </Box>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: "column"}}>
                    {trainingData.slice(0,1).map((item) => {return(
                      <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", pr:windowWidth >= 1980 ? "54.7px": "10px", pl: "21.6px", pt: "11.6px", pb: "11.6px", mt: "11.6px", bgcolor: '#fda072'}}>
                        <Typography sx={{fontWeight: "700", color: "#fff"}}>{item.name}</Typography>
                        <Typography sx={{fontWeight: "700", color: "#fff"}}>{item.count}</Typography>
                      </Card>
                    )})}
                    {trainingData.slice(1,3).map((item) => {return(
                      <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", pr:windowWidth >= 1980 ? "54.7px": "10px", pl: "21.6px", mt: "11.6px", bgcolor: '#E6E4F0'}}>
                        <Typography sx={{fontWeight: "500", color: "#777"}}>{item.name}</Typography>
                        <Typography sx={{fontWeight: "500", color: "#777"}}>{item.count}</Typography>
                      </Card>
                    )})}
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} >
              <Card sx={{width: "100%", height:"250px", p: '21.6px', maxHeight: '300px'}}>
                <Box sx={{borderBottom: "1px solid #F0EFF6"}}>
                    <Typography className="type-title" sx={{fontWeight: "700", fontSize: "1.1rem"}}>Faculty Leave</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", mr: windowWidth >= 1980 ? "21.6px": "5px", ml: "21.6px"}}>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Name</Typography>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Count</Typography>
                    </Box>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: "column"}}>
                    {leaveData.slice(0,1).map((item) => {return(
                      <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", pr:windowWidth >= 1980 ? "54.7px": "10px", pl: "21.6px", pt: "11.6px", pb: "11.6px", mt: "11.6px", bgcolor: '#fda072'}}>
                        <Typography sx={{fontWeight: "700", color: "#fff"}}>{item.name}</Typography>
                        <Typography sx={{fontWeight: "700", color: "#fff"}}>{item.count}</Typography>
                      </Card>
                    )})}
                    {leaveData.slice(1,3).map((item) => {return(
                      <Card sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", pr:windowWidth >= 1980 ? "54.7px": "10px", pl: "21.6px", mt: "11.6px", bgcolor: '#E6E4F0'}}>
                        <Typography sx={{fontWeight: "500", color: "#777"}}>{item.name}</Typography>
                        <Typography sx={{fontWeight: "500", color: "#777"}}>{item.count}</Typography>
                      </Card>
                    )})}
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
            
            
         
        <Card sx={{height:"100%",maxHeight: "500px",display:"flex", justifyContent: "center", alignItems: "center", p:windowWidth <= 576 ? 0 :"21.6px", ml: '21.6px', mr: '21.6px', mb: '21.6px'}} className="dash-cards">
        <div className="dash-letter">
                <div className="dash-letter-title">
                  <h3>Documents Today</h3>
                </div>
                <TableContainer
                  className="table-main"
                  sx={{maxHeight: "350px", tableLayout: "fixed", pl: "21.6px", pr: "21.6px", userSelect: "none" }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className="table-cell2"
                          align="left"
                          sx={{
                            minWidth: "100px",
                          }}
                        >
                          <Typography sx={{
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                            padding: "0"
                          }}> Document Name</Typography>
                        </TableCell>
                          <TableCell
                          className="table-cell2"
                          align="left"
                          style={{
                            minWidth: "100px",
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                          }}
                        >
                        <Typography sx={{
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                            padding: "0"
                          }}> Document Type</Typography>
                        </TableCell>
                          <TableCell
                        className="table-cell2"
                          align="left"
                          style={{
                            minWidth: "100px",
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                          }}
                        >
                          <Typography sx={{
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                            padding: "0"
                          }}> Received By</Typography>
                        </TableCell>
                        
                          <TableCell
                            className="table-cell2"
                              align="left"
                              style={{
                                minWidth: "100px",
                                fontWeight: "bold",
                                fontFamily: "Lato",
                                fontSize: "1rem",
                              }}
                            >
                            <Typography sx={{
                              fontWeight: "bold",
                              fontFamily: "Lato",
                              fontSize: "1rem",
                              padding: "0"
                            }}> Office/Dep</Typography>
                          </TableCell>
                          <TableCell
                        className="table-cell2"
                          align="left"
                          style={{
                            minWidth: "100px",
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                          }}
                        >
                          <Typography sx={{
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                            padding: "0"
                          }}> Date Received</Typography>
                        </TableCell>

                        
                        <TableCell
                        className="table-cell2"
                          align="left"
                          style={{
                            minWidth: "100px",
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            fontSize: "1rem",
                          }}
                          sx={{maxWidth: "5%"}}
                        >
                          {" "}
                          Action{" "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ height: "100%" }}>
                      {filteredDash
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <>
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.uID} sx={{cursor: "pointer", userSelect: "none", height: "50px", background: "#F0EFF6",'& :last-child': {borderBottomRightRadius: "10px", borderTopRightRadius: "10px"} ,'& :first-child':  {borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px"} }}>
                            <TableCell className={"table-cell"} align="left"> {row.document_Name} </TableCell>
                            <TableCell className={"table-cell"} align="left"> {row.Type == undefined || row.Type == "" ? row.document_Type : row.Type}</TableCell>
                            <TableCell className={"table-cell"} align="left"> {row.received_By} </TableCell>
                            <TableCell className={"table-cell"} align="left"> {row.fromDep == undefined ? row.fromPer : row.fromDep} </TableCell>
                            <TableCell className={"table-cell"} align="left"> {row.date_Received} </TableCell>
                            <TableCell className={"table-cell"} align="left">
                              <Stack spacing={1} direction="row">
                                <VisibilityIcon
                                  style={{
                                    fontSize: "30px",
                                    color: "#FFF",
                                    cursor: "pointer",
                                    background: "#FF6347",
                                    borderRadius: "5px",
                                  }}
                                  className="cursor-pointer"
                                  onClick={() => openFile(row.uID)}
                                />
                              </Stack>
                            </TableCell>
                          </TableRow>
                          </>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {loading ? (
                  <div className="load-container">
                    <span className="loader"></span>
                  </div>
                ) : (
                  ""
                )}
                {emptyResult ? (
                  <div className="nothing-holder">
                    <img className="noresult" src={noresult} />
                    <div className="nothing">No Documents found</div>
                    <div className="nothing-bottom">
                      No documents received today.
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <TablePagination
                  className="table-pagination"
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredDash.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </Card>
        <Dialog open={openShowLogs} fullWidth maxWidth="lg">
          <DialogTitle className="dialogDisplayTitle">
            <div className="display-title-holder">
              <div className="dialog-title-view">Logs</div>
              <div className="dialog-title-close">
                <button onClick={closeLogs}>Close</button>
              </div>
            </div>
          </DialogTitle>
          <DialogContent className="dialogDisplay">
            {loading2 ? (
              <div className="load-container2">
                <span className="loader"></span>
              </div>
            ) : (
              <div className="log-holder">
                <Box sx={{zIndex: 999, bgcolor: "#F0EFF6",display: "flex", flexDirection: windowWidth <= 576 ? "column" : "row", justifyContent: 'center', alignItems: 'center', p: windowWidth <= 576 ? "10px 0 0 0 " : "16px", borderBottom: "1px solid #888", position: 'sticky', top: 0}}>
                    <Box sx={{display: "flex", flexDirection: "row", mr: windowWidth <= 576 ? 0 : "30px"}}>
                      <Button onClick={(e) => setFilter10("")} sx={{fontSize: "0.9rem", textTransform: "none"}}>Clear date</Button>
                      <DatePicker disabled={filter5 || filter6}  label="Basic date picker" onChange={(e) => setFilter10(e)}/>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                      <FormControlLabel control={<Checkbox disabled={filter10} checked={filter5}  onChange={(e) => setFilter5(!filter5)}/>} label="This Month"/>
                      <FormControlLabel control={<Checkbox disabled={filter10} checked={filter6}  onChange={(e) => setFilter6(!filter6)}/>} label="This Day"/>
                    </Box>
                  </Box>
                <List>
                  {logData.length ? logData.filter((item) => 
                    filter10 == "" || filter10 == null? item.date.includes("") : item.date.includes(dayjs(filter10).format('MMM D, YYYY').toString())
                  ).filter((item) =>
                    filter5 == true ? (new Date(item.date).getMonth()).toString().includes(dayjs().month().toString()) : (new Date(item.date).getMonth()).toString().includes("")
                  ).filter((item) =>
                    filter6 == true ? (new Date(item.date).getDay()).toString().includes(dayjs().day().toString()) : (new Date(item.date).getDay()).toString().includes("")
                  ).map((logData) => {
                    return (
                      <>
                        <ListItem sx={{ borderBottom: "1px solid #c8d2d6" }} className="dialog-list">
                          <ListItemIcon>
                            <RadioButtonCheckedIcon className="dialog-radio"/>
                          </ListItemIcon>
                          <ListItemText>
                            <div className="log-display">
                              <span className="log-date">{logData.dateTime.toDateString()}</span>
                              <span className="log-data">{logData.log}</span>
                            </div>
                          </ListItemText>
                        </ListItem>
                      </>
                    );
                  }) : (
                    <div className="nothing-holder logsholder">
                      <img className="noresult" src={noresult} />
                      <div className="nothing">No Logs found</div>
                    </div>
                  )}
                </List>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={openShowDel} fullWidth maxWidth="sm">
          <DialogTitle className="dialogDisplayTitle">
            <div className="display-title-holder">
              <div className="dialog-title-view">Recently Deleted</div>
              <div className="dialog-title-close">
                <button onClick={closeDel}>Close</button>
              </div>
            </div>
          </DialogTitle>
          <DialogContent className="dialogDisplay">
            <AccordionReport />
          </DialogContent>
        </Dialog>
        <Dialog open={openShowFile} fullWidth maxWidth="xl">
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">View Document</div>
            <div className="dialog-title-close">
              <button onClick={closeFile}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay">
          {loading2 ? (
            <div className="load-container">
              <span className="loader"></span>
            </div>
          ) : (
            <section className="monitoring2">
              {displayFile.map((displayFile) => {
                return (
                  <div className="view-container">
                    <div className="view-details-container">
                      <div className="view-details">
                        <div className="details">
                          <h2>Document Name: </h2>
                          <p>{displayFile.document_Name}</p>
                        </div>
                        <div className="details">
                          <h2>Category: </h2>
                          <p>{displayFile.document_Type}</p>
                        </div>
                        {displayFile.Type == undefined ? "" : (
                            <div className="details">
                                <h2>Document Type:</h2>
                                <p>{displayFile.Type}</p>
                            </div>
                        )}
                        <div className="details">
                          <h2>Received By: </h2>
                          <p>{displayFile.received_By}</p>
                        </div>
                        <div className="details">
                          <h2>{displayFile.document_Type == "Student Document" ? "Student Name: ": displayFile.document_Type == "Faculty Document" ? "Faculty Name: ":displayFile.document_Type == "New Hire Document" ? "Applicant Name: ":displayFile.document_Type == "IPCR/OPCR" ? "Ratee Name: ": "Contact Person: "} </h2>
                          <p>{displayFile.fromPer}</p>
                        </div>
                        <div className="details">
                          <h2>Date Received: </h2>
                          <p>{displayFile.date_Received + " " + displayFile.time_Received}</p>
                        </div>
                        <div className="details">
                          <h2>Description:</h2>
                          <p>{displayFile.Description}</p>
                        </div>
                        {displayFile.Sched_Date == undefined ? "" : (
                            <div className="details">
                                <h2>Office/Dept:</h2>
                                <p>{displayFile.fromDep}</p>
                            </div>
                        )}
                        {displayFile.Sched_Date == undefined ? "" : (
                            <div className="details">
                                <h2>Schedule Date:</h2>
                                <p>{displayFile.Sched_Date}</p>
                            </div>
                        )}
                        {displayFile.Sched == undefined ? "" : (
                            <div className="details">
                                <h2>Meeting Details:</h2>
                                <p>{displayFile.Sched}</p>
                            </div>
                        )}
                        <div className="details">
                          <h2>Status: </h2>
                          <p>{displayFile.Status}</p>
                        </div>
                        <div className="details">
                          <h2>Comment/Note: </h2>
                          <p>{displayFile.Comment}</p>
                        </div>
                      </div>
                    </div>
                    <div className="view-img">
                      { [imageList, filePDF, fileDocx, fileXlsx].filter(arr => arr.length > 0).length >=2?(
                        <TabContext value={tabValue}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example" variant="scrollable">
                              {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Image/s" value="1" />}
                              {filePDF.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="PDF" value="2" />}
                              {fileDocx.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Docx" value="3" />}
                              {fileXlsx.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Excel" value="4" />}
                            </TabList>
                          </Box>
                          <TabPanel value="1">
                          <Grid container xs={12}>
                              <Button component="label" onClick={(e) => handleDownload("image")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "10px"}}>
                                      Download Image/s
                              </Button>
                              {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) &&(
                                    <ImageList variant="masonry" cols={windowWidth <= 375 ? 1 : windowWidth <=576 && windowWidth > 375? 2 : 3} gap={8}>
                                      {imageList.map((url, index) => (
                                            <ImageListItem key={url}>
                                              <img loading="eager" srcSet={`${port}/document_Files/${url}?w=248&fit=crop&auto=format&dpr=2 2x`} src={`${port}/document_Files/${url}?w=248&fit=crop&auto=format`} onClick={(e) => openLightbox(index)}/>
                                            </ImageListItem>                                  
                                      ))}
                                  </ImageList>
                                )}
                            </Grid>
                          </TabPanel>
                          <TabPanel value="2">
                            {
                              filePDF.length != 0 && (
                                <>
                                {windowWidth >= 768 ? (
                                  <>
                                    <TabContext value={currentPDF}>
                                    <TabList onChange={handlePDFChange} aria-label="lab API tabs example" variant="scrollable">
                                      {filePDF.map((pdf) => {
                                        return(
                                          <Tab sx={{textTransform: "none", fontSize: "1rem"}} label={pdf.file_Name.substring(37)} value={pdf}/>
                                        )
                                      })}
                                    </TabList>
                                    </TabContext>
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                                      <>
                                        
                                        {imageList && (
                                          <Box>
                                            <Viewer fileUrl={`${port}/document_Files/${currentPDF && currentPDF.file_Name}`} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark"/>
                                          </Box>
                                        )}  
                                        {!imageList && <>No PDF</>}
                                      </>
                                    </Worker>
                                  </>
                                ) : (
                                  <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  {filePDF.map((file) => {
                                    return(
                                        <>
                                          <img src={pdfIcon} style={{width: "150px", height: '150px'}}></img>
                                          <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                          <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#ff3232", textTransform: "none", marginBottom: "20px"}}>
                                            Download .pdf File
                                          </Button>
                                        </>
                                    )
                                        
                                  })}
                                  </Box>
                                )}
                                </>
                              )
                            }
                          </TabPanel>
                          <TabPanel value="3">
                            {
                              fileDocx.length != 0 && (
                                <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  {fileDocx.map((file) => {
                                    return(
                                        <>
                                          <img src={docxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                          <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                          <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "20px"}}>
                                            Download .docx File
                                          </Button>
                                        </>
                                    )
                                        
                                  })}
                                </Box>
                              )
                            }
                          </TabPanel>
                          <TabPanel value="4">
                            {
                              fileXlsx.length != 0 && (
                                <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  {fileXlsx.map((file) => {
                                    return(
                                        <>
                                          <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                          <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                          <Button component="label" onClick={(e) => handleDownload("xlsx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none", marginBottom: "20px"}}>
                                            Download .xlsx File
                                          </Button>
                                        </>
                                    )
                                        
                                  })}
                                </Box>
                              )
                            }
                          </TabPanel>
                      </TabContext>  
                      )
                      :
                      imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) ?(
                        <Grid container xs={12}>
                        <Button component="label" onClick={(e) => handleDownload("image")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "10px"}}>
                                  Download Image/s
                        </Button>
                        {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) &&(
                              <ImageList variant="masonry" cols={windowWidth <= 375 ? 1 : windowWidth <=576 && windowWidth > 375? 2 : 3} gap={8}>
                                {imageList.map((url, index) => (
                                      <ImageListItem key={url}>
                                        <img loading="eager" srcSet={`${port}/document_Files/${url}?w=248&fit=crop&auto=format&dpr=2 2x`} src={`${port}/document_Files/${url}?w=248&fit=crop&auto=format`} onClick={(e) => openLightbox(index)}/>
                                      </ImageListItem>                                  
                                ))}
                            </ImageList>
                          )}
                      </Grid>
                      ) 
                      :
                      filePDF.length != 0 ? (
                        <>
                        {windowWidth >= 768 ? (
                            <>
                              <TabContext value={currentPDF}>
                              <TabList onChange={handlePDFChange} aria-label="lab API tabs example" variant="scrollable">
                                {filePDF.map((pdf) => {
                                  return(
                                    <Tab sx={{textTransform: "none", fontSize: "1rem"}} label={pdf.file_Name.substring(37)} value={pdf}/>
                                  )
                                })}
                              </TabList>
                              </TabContext>
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                                <>
                                  
                                  {imageList && (
                                    <Box>
                                      <Viewer fileUrl={`${port}/document_Files/${currentPDF && currentPDF.file_Name}`} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark"/>
                                    </Box>
                                  )}  
                                  {!imageList && <>No PDF</>}
                                </>
                              </Worker>
                            </>
                          ) : (
                            <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {filePDF.map((file) => {
                              return(
                                  <>
                                    <img src={pdfIcon} style={{width: "150px", height: '150px'}}></img>
                                    <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                    <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#ff3232", textTransform: "none", marginBottom: "20px"}}>
                                      Download .pdf File
                                    </Button>
                                  </>
                              )
                                  
                            })}
                            </Box>
                          )}
                        </>
                      )
                      : fileDocx.length !=0 ? (
                        <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                          {fileDocx.map((file) => {
                            return(
                                <>
                                  <img src={docxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                  <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                  <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "20px"}}>
                                    Download .docx File
                                  </Button>
                                </>
                            )
                                
                          })}
                        </Box>
                      ) : fileXlsx.length !=0 ? (
                          <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {fileXlsx.map((file) => {
                              return(
                                  <>
                                    <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                    <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                    <Button component="label" onClick={(e) => handleDownload("xlsx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none", marginBottom: "20px"}}>
                                      Download .xlsx File
                                    </Button>
                                  </>
                              )
                                  
                            })}
                          </Box>
                      )
                      :
                      (
                        <div className="load-containerImage">
                          <span className="loader"></span>
                        </div>
                      )}
                      {isLightboxOpen && (
                        <Lightbox
                          mainSrc={`${port}/document_Files/${imageList[lightboxIndex]}`}
                          nextSrc={imageList[(lightboxIndex + 1) % imageList.length]}
                          prevSrc={imageList[(lightboxIndex + imageList.length - 1) % imageList.length]}
                          onCloseRequest={closeLightbox}
                          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + imageList.length - 1) % imageList.length)}
                          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % imageList.length)}
                          reactModalStyle={{ overlay: { zIndex: 9999 }, content: { zIndex: 9999 } }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </DialogContent>
      </Dialog>
      </section>
      </LocalizationProvider>
  );
}

export default Dashboard;
