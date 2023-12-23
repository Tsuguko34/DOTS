import React, { useState, useEffect } from "react";
import "./Pages.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import cn from "../components/cn";
import dayjs from "dayjs";
import noresult from "../Images/noresults.png";
import user from "../Images/user.png";
import noresult2 from "../Images/noresult2.png";
import Calendar from "../components/Calendar";
import Welcome from '../Images/welcome2.png'
import LogsPic from '../Images/Logs.png'
import DeletePic from '../Images/delete.png'
import { auth, db, firestore, storage } from "../firebase";
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

ChartJS.register(ArcElement, Tooltip, Legend);
//sample comment hahaha

function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [data1, setData1] = useState(0);
  const [data2, setData2] = useState(0);
  const [data3, setData3] = useState(0);
  const [data4, setData4] = useState(0);
  const [data5, setData5] = useState(0);
  const [data6, setData6] = useState(0);
  const [data7, setData7] = useState(0);
  const [data8, setData8] = useState(0);
  const [data9, setData9] = useState(0);
  const [data10, setData10] = useState(0);
  const [data11, setData11] = useState(0);
  const [data12, setData12] = useState(0);
  const [data13, setData13] = useState(0);
  const [data14, setData14] = useState(0);
  const [data15, setData15] = useState(0);
  const [data16, setData16] = useState(0);
  const [data17, setData17] = useState(0);
  const [data18, setData18] = useState(0);
  const [data19, setData19] = useState(0);
  const [others, setOthers] = useState(false)
  const showOthers = () => setOthers(!others);
  

  const dashboardCollectionRef = collection(db, "documents");
  const [loginWith, setLoginWith] = useState(true)
  const [travelOrderData, setTravelOrderData] = useState([])
  const [trainingData, setTrainingData] = useState([])
  const [leaveData, setLeaveData] = useState([])
  const [travelData, setTravelData] = useState([])
  const getChartData1 = async () => {
    
    const q = query(dashboardCollectionRef);
    const data = await getDocs(q);
    const TravelOrderSet = new Set()
    const TrainingSet = new Set()
    const LeaveSet = new Set()

    data.docs.forEach((doc) => {
      const docType = doc.data().document_Type
      const Type = doc.data().Type

      if(docType == "Communication"){
        setData1(prev => prev + 1)
      }
      else if(docType === "Memorandum"){
        setData2(prev => prev + 1)
      }
      else if(docType === "Student Document" && Type === "Completion Form"){
        setData3(prev => prev + 1)
        setData16(prev => prev + 1)
      }
      else if(docType === "Student Document" && Type === "Correction of Grades"){
        setData4(prev => prev + 1)
        setData16(prev => prev + 1)
      }
      else if(docType === "Faculty Document" && Type === "Estimates of Honoraria"){
        setData5(prev => prev + 1)
        setData17(prev => prev + 1)
      }
      else if(docType === "Faculty Document" && Type === "Faculty Teaching Load"){
        setData6(prev => prev + 1)
        setData17(prev => prev + 1)
      }
      else if(docType === "Faculty Document" && Type === "Faculty Workload"){
        setData7(prev => prev + 1)
        setData17(prev => prev + 1)
      }
      else if(docType === "Faculty Document" && Type === "Application for Leave"){
        setData8(prev => prev + 1)
        setData17(prev => prev + 1)
        const existing = leaveData.findIndex((item) => item.name === doc.data().fromPer)
        if(existing !== -1){
          leaveData[existing].count += 1
        }else{
          leaveData.push({name: doc.data().fromPer, count: 1})
        }
      }
      else if(docType === "Faculty Document" && Type === "Training Request Form"){
        setData9(prev => prev + 1)
        setData17(prev => prev + 1)
        const existing = trainingData.findIndex((item) => item.name === doc.data().fromPer)
        if(existing !== -1){
          trainingData[existing].count += 1
        }else{
          trainingData.push({name: doc.data().fromPer, count: 1})
        }
      }
      else if(docType === "New Hire Document" && Type === "Personel Requisition Form"){
        setData10(prev => prev + 1)
        setData18(prev => prev + 1)
      }
      else if(docType === "New Hire Document" && Type === "Contract"){
        setData11(prev => prev + 1)
        setData18(prev => prev + 1)
      }
      else if(docType === "IPCR/OPCR" && Type === "IPCR"){
        setData12(prev => prev + 1)
        setData19(prev => prev + 1)
      }
      else if(docType === "IPCR/OPCR" && Type === "OPCR"){
        setData13(prev => prev + 1)
        setData19(prev => prev + 1)
      }
      else if(docType === "Travel Order"){
        setData14(prev => prev + 1)
        const existing = travelOrderData.findIndex((item) => item.name === doc.data().fromPer)
        if(existing !== -1){
          travelOrderData[existing].count += 1
        }else{
          travelOrderData.push({name: doc.data().fromPer, count: 1})
        }
      }
      else if(docType === "Meeting Request"){
        setData15(prev => prev + 1)
      }
    })
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
    labels:[
      "Communication Letter",
      "Memorandum",
      "Completion Form",
      "Correction of Grades",
      "Estimates of Honoraria",
      "Faculty Teaching Load",
      "Faculty Workload",
      "Application for Leave",
      "Training Request Form",
      "Personel Requisition Form",
      "Letter of Contract",
      "IPCR",
      "OPCR",
      "Travel Order",
      "Meeting request",
    ],
    datasets: [
      {
        label: "Number of Documents",
        data: [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15],
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
  //FIREBASE-------------------------------------------------
  //INPUTS

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
    const data = await getDocs(q);
    const archiveDocs = await getDocs(collection(db, "archive"))
    archiveDocs.docs.forEach((doc) => {
      if(doc.data().Folder == undefined){
        setarchiveDoc(prev => prev + 1)
      }
    })
    setDashboard(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
    if (data.docs.length > 0) {
      setLoading(false);
      document.getElementById("total2").innerHTML = data.docs.length;
    }else{
      setLoading(false);
      setEmptyResult(true)
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  

  const getMonthYearData = async () => {
    const yearMonthData = await getDocs(q2);
    setYearMonth(
      yearMonthData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    let i = 0;
    let x = 0;
    let y = 0;
    await yearMonth.map((yearMonth) => {
      if (dayjs().isSame(yearMonth.date_Received, "year")) {
        i += 1;
      }
      if (dayjs().isSame(yearMonth.date_Received, "month")) {
        x += 1;
      }
      if (dayjs().isSame(yearMonth.date_Received, "day")) {
        y += 1;
      }
      document.getElementById("total2").innerHTML = y;
      document.getElementById("total3").innerHTML = x;
      document.getElementById("total4").innerHTML = i;
    });
  };

  useEffect(() => {
    getMonthYearData();
  }, [dashboard]);



  const [userName, setuserName] = useState("");
  const [profilePic, setProfilePic] = useState(user)
  const getUserInfo = async () => {
    setLoginWith(!setLoginWith)
    const { uid } = auth.currentUser;
    if (!uid) return;
    const userRef = collection(db, "Users");
    const imageListRef = ref(storage, `/ProfilePics/${uid}`);
    const q = query(userRef, where("UID", "==", uid));
    const data = await getDocs(q);
    const image = await getDownloadURL(imageListRef)
    setProfilePic(image)
    setUserInfo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setuserName(data.docs.map((doc) => doc.data().full_Name))
  };

  const [userHolder, setuserHolder] = useState(null);
  const [googleName, setGoogleName] = useState("")
  const [googleEmail, setGoogleEmail] = useState("")
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async(authObj) => {
      unsub();
      if (authObj) {
        setuserHolder(authObj);
        const userq = query(collection(db, "Users"))
        const userData = await getDocs(userq)
        setUsers(userData.docs.map((doc) => ({...doc.data(), id: doc.id})))
      } else {
        setuserHolder(null);
      }
    });
  }, []);

  const getSignInMethods = () => {
    if (userHolder) {
      const signInMethods = userHolder.providerData.map(
        (provider) => provider.providerId
      );
      if (signInMethods.includes("google.com")) {
        setLoginWith(true)
        setGoogleName(auth.currentUser.displayName)
        setGoogleEmail(auth.currentUser.email)
        setProfilePic(localStorage.getItem("profilePic"))
      } else if (signInMethods.includes("password")) {
        getUserInfo()
        setuserName(auth.currentUser.displayName)
        setGoogleEmail(auth.currentUser.email)
      }
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
    const q = query(logcollectionRef, orderBy("date", "desc"));
    const data = await getDocs(q);
    const LogDataset = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, dateTime: new Date(doc.data().date) }));
    // Sort the data by year, month, day, and time in descending order
    LogDataset.sort((a, b) => {
      if (b.dateTime.getFullYear() !== a.dateTime.getFullYear()) {
        return b.dateTime.getFullYear() - a.dateTime.getFullYear();
      } else if (b.dateTime.getMonth() !== a.dateTime.getMonth()) {
        return b.dateTime.getMonth() - a.dateTime.getMonth();
      } else if (b.dateTime.getDate() !== a.dateTime.getDate()) {
        return b.dateTime.getDate() - a.dateTime.getDate();
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
      if(userHolder && (forward.includes("All") ||  forward.includes(users.find(item => item.UID == auth.currentUser.uid)?.role) || forward == auth.currentUser.uid)){
        console.log(doc);
        filterDashData.push(doc)
        setEmptyResult(false)
        setLoading(false)
      }
    });
    setFilteredDash(filterDashData)
    if (filteredDash.length == 0){
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

  const openFile = (id) => {
    setOpenShowFile(true);
    showFile(id);
  };
  const showFile = async (id) => {
    let q = query(collection(db, "documents"), where("uID", "==", id));
    const imageListRef = ref(storage, `DocumentsPic/${id}/`);
    const data = await getDocs(q);
    setDisplayFile(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getMetadata(item).then((metadata) => {
          if(metadata.contentType.startsWith('image/')){
            getDownloadURL(item).then((url) => {
              setImageList((prev) => [...prev, url]);
            });
          }
          else if (metadata.contentType == "application/pdf"){
              getDownloadURL(item).then(async(url) => {
                 setFilePDF(url);
                 console.log(url);
              })
          }
          else if (metadata.contentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
            getDownloadURL(item).then(async(url) => {
                setFileDocx({name: metadata.name, url: url});
            })
          }
          else if (metadata.contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            getDownloadURL(item).then(async(url) => {
                setFileXlsx({name: metadata.name, url: url});
            })
          }
        })
      });
    });
    setLoading2(false);
  };

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
   const [tabValue, setTabValue] = useState('1');
   const handleTabChange = (event, newValue) => {
     setTabValue(newValue);
   };
 
   const handleDownload = (type) => {
       const anchor = document.createElement('a');
       if (type == "docx"){
         anchor.href = fileDocx.url;
         anchor.download = fileDocx.name;
       }
       else if(type == "xlsx"){
         anchor.href = fileXlsx.url;
         anchor.download = fileXlsx.name;
       }
       anchor.target = '_blank';
       anchor.click();
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
                        Welcome, <Typography sx={{fontSize:windowWidth <= 768 && windowWidth > 425 ? "1.3rem" :windowWidth < 425 ? "1rem" : "1.5rem", color: "#E6E4F0", fontWeight: 'bold'}}> &nbsp;{auth.currentUser != undefined && users.find(item => item.UID == auth.currentUser.uid)?.role}</Typography>
                      </Typography>
                      <Typography variant="div" className="welcome-hello2" sx={{fontSize:windowWidth <= 768 && windowWidth > 425 ? "1.3rem" :windowWidth < 425 ? "1rem" : "1.5rem", fontWeight: 'bold'}}>
                        {auth.currentUser != undefined && auth.currentUser.displayName == undefined ? userName : googleName}
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
                    <h2 id="total2">0</h2>
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
                    <h2 id="total3">0</h2>
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
                    <h2 id="total4">0</h2>
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
            {auth.currentUser != undefined && users.find(item => item.UID == auth.currentUser.uid)?.role !== "Faculty" ? (<>
              <Typography sx={{fontSize: "1.2rem", fontWeight: "bold"}} className="type-title"><Typewriter words={['Document Types']} typeSpeed={40}/></Typography>
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
                <div className="dash-graphs-holder">
                  <div className="calendar-holder">
                    <div className="calendar-card">
                      <Calendar />
                    </div>
                  </div>
                </div>
              </Card>
              </>
              
            )}
            
          </Grid>
        </Grid>
        {auth.currentUser != undefined && users.find(item => item.UID == auth.currentUser.uid)?.role !== "Faculty" && (
          <Grid container xs={12} sx={{pr: "21.6px", pl: "21.6px", pb: "21.6px"}} gap={2} flexWrap={windowWidth >= 1024 ? "noWrap" : ''} overflow={"hidden"}>
          <Grid container item>
            <Grid item xs={12}>
              <Card sx={{width: "100%", height:"250px", p: '21.6px', mb: "11.6px", maxHeight: '300px'}}>
                <Box sx={{borderBottom: "1px solid #F0EFF6"}}>
                  <Typography className="type-title" sx={{fontWeight: "700", fontSize: "1.1rem"}}>Faculty Travel Orders</Typography>
                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", mr: "54.7px", ml: "21.6px"}}>
                    <Typography sx={{fontWeight: "700", color: "#888"}}>Name</Typography>
                    <Typography sx={{fontWeight: "700", color: "#888"}}>Amount</Typography>
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
            <Grid item xs={12} sm={12} md={5.9}>
              <Card sx={{width: "100%", height:"240px", p: '21.6px', mb: windowWidth >= 1024 ? 0 : "11.6px", maxHeight: '300px' }}>
                <Box sx={{borderBottom: "1px solid #F0EFF6"}}>
                    <Typography className="type-title" sx={{fontWeight: "700", fontSize: "1.1rem"}}>Faculty Training</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", mr: windowWidth >= 1980 ? "21.6px": "5px", ml: "21.6px"}}>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Name</Typography>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Amount</Typography>
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
            <Grid item xs={12} sm={12} md={5.9} sx={{ml: windowWidth >= 1980 && windowWidth <= 2560 ? "10px" :windowWidth >= 1440 ? "5px" : 0}}>
              <Card sx={{width: "100%", height:"240px", p: '21.6px', maxHeight: '300px'}}>
                <Box sx={{borderBottom: "1px solid #F0EFF6"}}>
                    <Typography className="type-title" sx={{fontWeight: "700", fontSize: "1.1rem"}}>Faculty Leave</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: "center", mr: windowWidth >= 1980 ? "21.6px": "5px", ml: "21.6px"}}>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Name</Typography>
                      <Typography sx={{fontWeight: "700", color: "#888", fontSize: "0.9rem"}}>Amount</Typography>
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
          
          <Grid container item >
           
              <Grid container sx={12} gap={2} wrap="noWrap">
              <Grid item xs={12}>
                <Card sx={{width: '100%',height: "100px", display:"flex", justifyContent: "center", alignItems: "center", p: "21.6px", mb: "21.8px", maxHeight: '100px', userSelect: 'none'}} className="dash-gradient">
                {auth.currentUser != undefined && users.find(item => item.UID == auth.currentUser.uid)?.role === "Dean" && (
                  <div className="welcome-holder2" onClick={openLogs} style={{cursor: "pointer", userSelect: "none"}}>
                    <div className="welcome-img">
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
              <Card sx={{height: windowWidth > 768 ? "350px" : "400px",maxHeight: "400px", display:"flex", justifyContent: "center", alignItems: "center", p:windowWidth > 768 ? "21.6px" : 0}} className="dash-cards">
                <div className="dash-graphs-holder">
                  <div className="calendar-holder">
                    <div className="calendar-card">
                      <Calendar />
                    </div>
                  </div>
                </div>
              </Card>
            </Grid>
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
        <Dialog open={openShowLogs} fullWidth maxWidth="md">
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
                      { imageList.length !=0 && filePDF.length != 0 ?(
                        <TabContext value={tabValue}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example" variant="scrollable" allowScrollButtonsMobile>
                              {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Image/s" value="1" />}
                              {filePDF.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="PDF" value="2" />}
                              {fileDocx.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Docx" value="3" />}
                              {fileXlsx.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Excel" value="4" />}
                            </TabList>
                          </Box>
                          <TabPanel value="1">
                          <Grid container xs={12}>
                              {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) &&(
                                    <ImageList variant="masonry" cols={windowWidth <= 375 ? 1 : windowWidth <=576 && windowWidth > 375? 2 : 3} gap={8}>
                                      {imageList.map((url, index) => (
                                            <ImageListItem key={url}>
                                              <img loading="eager" srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`} src={`${url}?w=248&fit=crop&auto=format`} onClick={(e) => openLightbox(index)}/>
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
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                                  {imageList && (
                                    <>
                                      <Viewer fileUrl={filePDF} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark" />
                                    </>
                                  )}  
                                  {!imageList && <>No PDF</>}
                                </Worker>
                                </>
                              )
                            }
                          </TabPanel>
                          <TabPanel value="3">
                            {
                              fileDocx.length != 0 && (
                                <>
                                <Box sx={{width: "100%", height: '300px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  <img src={docxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                  <Typography sx={{mt: "54.7px"}}>{fileDocx.name}</Typography>
                                  <Button component="label" onClick={(e) => handleDownload("docx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none"}}>
                                    Download .docx File
                                  </Button>
                                </Box>
                                </>
                              )
                            }
                          </TabPanel>
                          <TabPanel value="4">
                            {
                              fileXlsx.length != 0 && (
                                <>
                                <Box sx={{width: "100%", height: '300px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                  <Typography sx={{mt: "54.7px"}}>{fileXlsx.name}</Typography>
                                  <Button component="label" onClick={(e) => handleDownload("xlsx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none"}}>
                                    Download .xlsx File
                                  </Button>
                                </Box>
                                </>
                              )
                            }
                          </TabPanel>
                      </TabContext>  
                      )
                      :
                      imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) ?(
                        <Grid container xs={12}>
                        {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) &&(
                              <ImageList variant="masonry" cols={windowWidth <= 375 ? 1 : windowWidth <=576 && windowWidth > 375? 2 : 3} gap={8}>
                                {imageList.map((url, index) => (
                                      <ImageListItem key={url}>
                                        <img loading="eager" srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`} src={`${url}?w=248&fit=crop&auto=format`} onClick={(e) => openLightbox(index)}/>
                                      </ImageListItem>                                  
                                ))}
                            </ImageList>
                          )}
                      </Grid>
                      ) 
                      :
                      filePDF.length != 0 ? (
                        <>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                          {imageList && (
                            <>
                              <Viewer fileUrl={filePDF} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark" />
                            </>
                          )}  
                          {!imageList && <>No PDF</>}
                        </Worker>
                        </>
                      )
                      : fileDocx.length !=0 ? (
                          <>
                            <Box sx={{width: "100%", height: '300px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                              <img src={docxViewIcon} style={{width: "150px", height: '150px'}}></img>
                              <Typography sx={{mt: "54.7px"}}>{fileDocx.name}</Typography>
                              <Button component="label" onClick={(e) => handleDownload("docx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none"}}>
                                Download .docx File
                              </Button>
                            </Box>
                            
                          </> 
                      ) : fileXlsx.length !=0 && (
                        <>
                          <Box sx={{width: "100%", height: '300px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                            <Typography sx={{mt: "54.7px"}}>{fileXlsx.name}</Typography>
                            <Button component="label" onClick={(e) => handleDownload("xlsx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none"}}>
                              Download .xlsx File
                            </Button>
                          </Box>
                        </> 
                      )
                      }
                      {isLightboxOpen && (
                        <Lightbox
                          mainSrc={imageList[lightboxIndex]}
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
