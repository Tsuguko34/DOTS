import React, { useEffect, useState } from 'react'
import './Pages.css'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Autocomplete, Box, Button, Card, CardContent, CardMedia, Checkbox, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, Grid, Hidden, ImageList, ImageListItem, InputAdornment, InputLabel, Menu, MenuItem, Select, Stack, SwipeableDrawer, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import imageExamp from '../Images/pimentel.png'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { auth, db, storage } from '../firebase'
import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage'
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from "@mui/icons-material/FilterList";
import noresult from '../Images/noresults.png'
import RestorePageIcon from '@mui/icons-material/RestorePage';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';
import DocViewer, { DocViewerRenderers }  from "@cyntler/react-doc-viewer";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { BitlyClient } from "bitly";
import { CloudDownload } from "@mui/icons-material";
import docxViewIcon from '../Images/docxView.png'
import xlsxViewIcon from '../Images/xlsxView.png'
import pdfIcon from '../Images/pdf.png'
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios'
function ArchiveMainTable() {
  const port = "http://localhost:3001"
    const newPlugin = defaultLayoutPlugin();
    const pagePlugin = pageNavigationPlugin();
    const { documentType, year } = useParams()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const archiveRef = collection(db, "archive")
    const [archiveYears, setArchiveYears] = useState([])
    const [archiveData, setArchiveData] = useState([])
    const [archiveImage, setArchiveImage] = useState([])
    const [loading, setLoading] = useState(true);
    const [emptyResult, setEmptyResult] = useState(false);
    useEffect(() => {
        const handleWindowResize = () => {
        setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
        window.removeEventListener('resize', handleWindowResize);
        };
    });

    const getArchive = async() => {
        const data = await axios.get(`${port}/getFilteredArchives?documentType=${documentType.replace('%20', ' ').replace('IPCR-OPCR', 'IPCR/OPCR')}&year=${year}`)
        const images = await axios.get(`${port}/getArchiveFiles`)
        console.log(data.data);
        setArchiveImage(images.data)
        setArchiveData(data.data)
        setLoading(false)
    }

    useEffect(() => {
        setArchiveYears([])
        getArchive()
        console.log(archiveData);
    }, [])

    useEffect(() => {
      if(!archiveData){
        Navigate('./pages/Archives')
      }
    }, [archiveData])

    const [fileInfo, setFileInfo] = useState("")
    const [fileType, setFileType] = useState("")
    const [fileDate, setFileDate] = useState("")
    const [fileReceivedBy, setFileReceivedBy] = useState("")
    const [fileFromDep, setFileFromDep] = useState("")
    const [fileFromPer, setFileFromPer] = useState("")
    const [fileDesc, setFileDesc] = useState("")
    const [fileImage, setFileImage] = useState("")
    const [fileuID, setFileuID] = useState("")
    const [fileid, setFileid] = useState("")
    const [openPull, setOpenPull] =useState(false)
    const openPullTab = () => {
      setOpenPull(true)
    }
    const closePullTab = () => {
      setOpenPull(false)
    }

    const displayFileInfo = (type, date, received, dep, per, desc, image, uID, id) => {
        const fileIMG = image.includes(".png" || ".jpg" || ".jpeg") ? `${port}/document_Files/${image}` : image.includes(".pdf") ? pdfIcon : image.includes(".docx") ? docxViewIcon : image.includes(".xlsx") && xlsxViewIcon 
        setFileInfo("")
        const data = {
            Type: type,
            date_Received: date,
            received_By: received,
            fromDep: dep,
            fromPer: per,
            Description: desc,
            Image: fileIMG,
            uID: uID,
            id: id
        }
        setFileInfo(data)
        windowWidth <= 768 && openPullTab()
    }

    useEffect(() => {
        setFileType(fileInfo.Type)
        setFileDate(fileInfo.date_Received)
        setFileReceivedBy(fileInfo.received_By)
        setFileFromDep(fileInfo.fromDep)
        setFileFromPer(fileInfo.fromPer)
        setFileDesc(fileInfo.Description)
        setFileImage(fileInfo.Image)
        setFileuID(fileInfo.uID)
        setFileid(fileInfo.id)
    }, [fileInfo])

  const logcollectionRef = collection(db, "logs");
  const [userInfo, setUserInfo] = useState([]);
  const [userHolder, setuserHolder] = useState(null);
    const getUserInfo = async (type, name) => {
        const { uid } = auth.currentUser;
        if (!uid) return;
        const userRef = collection(db, "Users");
        const q = query(userRef, where("UID", "==", uid));
        const data = await getDocs(q);
        setUserInfo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        console.log(userInfo);
        if (type == "restore") {
          await addDoc(logcollectionRef, {
            date: dayjs().format("MMM D, YYYY h:mm:ss A").toString(),
            log: data.docs.map((doc) => doc.data().full_Name)  + ` restored ${name}`,
          });
        } else if (type == "delete") {
          await addDoc(logcollectionRef, {
            date: dayjs().format("MMM D, YYYY h:mm:ss A").toString(),
            log: data.docs.map((doc) => doc.data().full_Name)  + " deleted an archive document",
          });
        }
      };
    
      useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
          unsub();
          if (authObj) {
            setuserHolder(authObj);
          } else {
            setuserHolder(null);
          }
        });
      }, []);
    
      const getSignInMethods = async (type, name) => {
        if (userHolder) {
          const signInMethods = userHolder.providerData.map(
            (provider) => provider.providerId
          );
          if (signInMethods.includes("google.com")) {
            if (type == "restore") {
              await addDoc(logcollectionRef, {
                date: dayjs().format("MMM D, YYYY h:mm A").toString(),
                log: auth.currentUser.displayName + " restored an archive document",
              });
            } else if (type == "delete") {
              await addDoc(logcollectionRef, {
                date: dayjs().format("MMM D, YYYY h:mm A").toString(),
                log: auth.currentUser.displayName + " deleted an archive document",
              });
            }
          } else if (signInMethods.includes("password")) {
            getUserInfo(type, name);
          }
        }
        return null;
      };

    const restoreDoc = async (id) => {
        Swal.fire({
          text: "Restore File?",
          confirmButtonColor: "#52E460",
          showDenyButton: true,
          denyButtonColor: "#888",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.value) {
            const q = query(collection(db, "archive"), where("uID", "==", id))
            const querySnapshot = await getDocs(q);
            restoreApi(id, querySnapshot.docs[0].data());
          }
        });
        
      };
      const restoreApi = async (id, data) => {
        const recentDoc = doc(collection(db, "documents"));
        await setDoc(recentDoc, data)
        const q = query(collection(db, "archive"), where("uID", "==", id))
        const querySnapshot = await getDocs(q);
        await deleteDoc(querySnapshot.docs[0].ref);
        getSignInMethods("restore", data.document_Type);
        toast.success("File Restored")
        setFileInfo("")
        getArchive()
      };

      const deleteApi = async (id, data) => {
        const recentDoc = doc(collection(db, "recently_deleted"));
        await setDoc(recentDoc, data);
        await deleteDoc(doc(db, "archive", id));
        getSignInMethods("delete");
        toast.success("Successfully deleted the file.")
        setFileInfo("")
        getArchive();
      };

      //View File
      const [openShowFile, setOpenShowFile] = useState(false);
      const [displayFile, setDisplayFile] = useState([]);
      const [imageList, setImageList] = useState([]);
      const [loading2, setLoading2] = useState(true);
      const [filePDF, setFilePDF] = useState([]);
      const [fileDocx, setFileDocx] = useState([]);
      const [fileXlsx, setFileXlsx] = useState([]);
    
      const openFile = (id) => {
        setOpenShowFile(true);
        showFile(id);
      };
      const showFile = async (id) => {
        const imageListRef = await axios.get(`${port}/getFile?id=${id}`);
        const data = await axios.get(`${port}/openArchiveFile?id=${id}`);
        setDisplayFile(data.data);
        imageListRef.data.forEach((item) => {
          console.log(item);
            if(item.file_Name.includes('.png') || item.file_Name.includes('.jpg') || item.file_Name.includes('.jpeg')){
                setImageList((prev) => [...prev, item.file_Name]);
            }
            else if (item.file_Name.includes('.pdf')){
                    setFilePDF(item.file_Name);
            }
            else if (item.file_Name.includes('.docx') || item.file_Name.includes('.doc')){
                  setFileDocx(item.file_Name);
            }
            else if (item.file_Name.includes('.xlsx')){
                  setFileXlsx(item.file_Name);
            }
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

    //Filer
    const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");
  const [filter4, setFilter4] = useState(false);
  const [filter5, setFilter5] = useState(false);
  const [filter6, setFilter6] = useState(false);
  const [filter7, setFilter7] = useState("");
  const [filter8, setFilter8] = useState("");
  const [filter9, setFilter9] = useState("");
  const [filter10, setFilter10] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredOptionsName, setFilteredOptionsName] = useState([]);
  const [filteredOptionsDocType, setFilteredOptionsDocType] = useState([]);
  const [filteredOptionsReceive, setFilteredOptionsReceive] = useState([]);
  const [filteredOptionsfromDep, setFilteredOptionsfromDep] = useState([]);
  const [filteredOptionsDateReceived, setFilteredOptionsDateReceived] = useState([]);
  const [filteredOptionsStatus, setFilteredOptionsStatus] = useState([]);
  useEffect(() => {
    const filteredOptionName = new Set()
    const filteredOptionDocType = new Set()
    const filteredOptionReceive = new Set()
    const filteredOptionfromDep = new Set()
    const filteredOptionDate = new Set()
    const filteredOptionStatus = new Set()
    const filtered = archiveData.filter((item) =>
      item.received_By.toLowerCase().includes(search.toLowerCase())||
      item.fromPer.toLowerCase().includes(search.toLowerCase()) ||
      item.document_Name.toLowerCase().includes(search.toLowerCase()) || 
      item.Description.toLowerCase().includes(search.toLowerCase()) || 
      item.Comment.toLowerCase().includes(search.toLowerCase())
    ).filter((item) =>
        item.document_Name == undefined ? item.document_Name.toLowerCase().includes(filter.toLowerCase()) : item.document_Name.toLowerCase().includes(filter.toLowerCase())
    ).filter((item) =>
        item.fromDep == undefined ? item.fromPer.toLowerCase().includes(filter9.toLowerCase()) :  item.fromDep.toLowerCase().includes(filter9.toLowerCase())
    ).filter((item) =>
        item.Type == undefined ? item.document_Type.toLowerCase().includes(filter8.toLowerCase()) : item.Type.toLowerCase().includes(filter8.toLowerCase())
    ).filter((item) => 
      item.received_By.toLowerCase().includes(filter2.toString().toLowerCase())
    ).filter((item) => 
      filter10 == "" || filter10 == null? item.date_Received.includes("") : item.date_Received.includes(dayjs(filter10).format('MM/DD/YYYY').toString())
    ).filter((item) =>
      filter3 != "" ? item.Status.toLowerCase() === filter3.toLowerCase(): item.Status.toLowerCase().includes("")
    ).filter((item) =>
      filter4 == true ? (new Date(item.date_Received).getFullYear()).toString().includes(dayjs().year().toString()) : (new Date(item.date_Received).getFullYear()).toString().includes("")
    ).filter((item) =>
      filter5 == true ? (new Date(item.date_Received).getMonth()).toString().includes(dayjs().month().toString()) : (new Date(item.date_Received).getMonth()).toString().includes("")
    ).filter((item) =>
      filter6 == true ? (new Date(item.date_Received).getDay()).toString().includes(dayjs().day().toString()) : (new Date(item.date_Received).getDay()).toString().includes("")
    )

  filtered.forEach(doc => {
      filteredOptionName.add(doc.document_Name)
      filteredOptionDocType.add(doc.Type == undefined ? doc.document_Type : doc.Type)
      filteredOptionReceive.add(doc.received_By)
      filteredOptionStatus.add(doc.Status)
      filteredOptionfromDep.add(doc.fromDep == undefined ? doc.fromPer : doc.fromDep)
      const [timePart, ampm] = doc.time_Received.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      doc.time = new Date();
      doc.time.setHours(hours);
      doc.time.setMinutes(minutes);
   })

   const timeFiltered = filtered.sort((a, b) => b.time - a.time)

   try{
    timeFiltered.sort((a, b) => {
      if (new Date(b.date_Received).getFullYear() !== new Date(a.date_Received).getFullYear()) {
        return new Date(b.date_Received).getFullYear() - new Date(a.date_Received).getFullYear();
      } else if (new Date(b.date_Received).getMonth() !== new Date(a.date_Received).getMonth()) {
        return new Date(b.date_Received).getMonth() - new Date(a.date_Received).getMonth();
      } else {
        return new Date(b.date_Received).getDate() - new Date(a.date_Received).getDate();
      }
   })
   }catch(e){
    console.log(e.message);
   }
   


    setFilteredOptionsReceive(Array.from(filteredOptionReceive))
    setFilteredOptionsfromDep(Array.from(filteredOptionfromDep))
    setFilteredOptionsDocType(Array.from(filteredOptionDocType))
    setFilteredOptionsName(Array.from(filteredOptionName))
    setFilteredOptionsStatus(Array.from(filteredOptionStatus))
    setFilteredData(timeFiltered);
  }, [archiveData, search, filter, filter2, filter3, filter4, filter5, filter6, filter7, filter8, filter9, filter10]);

  //FILTEROPEN
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [anchorEl5, setAnchorEl5] = useState(null);
  const [anchorEl6, setAnchorEl6] = useState(null);
  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);
  const open4 = Boolean(anchorEl4);
  const open5 = Boolean(anchorEl5);
  const open6 = Boolean(anchorEl6);
  const handleFilter = (event, buttonNumber) => {
    if(buttonNumber === 1){
      setAnchorEl1(event.currentTarget);
    }
    else if(buttonNumber === 2){
      setAnchorEl2(event.currentTarget);
    }
    else if(buttonNumber === 3){
      setAnchorEl3(event.currentTarget);
    }
    else if(buttonNumber === 4){
      setAnchorEl4(event.currentTarget);
    }
    else if(buttonNumber === 5){
      setAnchorEl5(event.currentTarget);
    }
    else if(buttonNumber === 6){
      setAnchorEl6(event.currentTarget);
    }
  }
    
  const handleFilterClose = (event, buttonNumber) => {
    if(buttonNumber === 1){
      setAnchorEl1(null);
    }
    else if(buttonNumber === 2){
      setAnchorEl2(null);
    }
    else if(buttonNumber === 3){
      setAnchorEl3(null);
    }
    else if(buttonNumber === 4){
      setAnchorEl4(null);
    }
    else if(buttonNumber === 5){
      setAnchorEl5(null);
    }
    else if(buttonNumber === 6){
      setAnchorEl6(null);
    }
  };

  //Limit filter letters
  const limitFilterText = (text, limit) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };



      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(5);
      const [rows, setRows] = useState([]);
    
      useEffect(() => {
        getArchive();
      }, [page]);

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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

  

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <section className='monitoring'>
            <Toaster position='bottom-center'/>
            <div className='page-title'>
              <p>Dean's Office Transaction</p>
              <p>{documentType + " "}Archives</p>
            </div>
            <div className="monitoring-content-holder">
              <div className="table-holder">
              </div>
            </div>
            <Grid container xs={12} sx={{padding: "20px", height: "100%"}} gap={2} flexWrap={windowWidth >= 1024 ? "noWrap" : ''}>  
                <Grid item xs={12} md={8} lg={9} xl={9}>
                <Card sx={{padding: "20px", mb: "20px", height: "100%",maxHeight: "740px"}} className='dash-cards'>
                    <Box sx={{width: "100%", display: "flex", justifyContent: "start", alignItems: "center", pl: "20px"}}>
                      <Typography sx={{ fontSize: '1.1rem', "& :hover": {bgcolor: "#F0EFF6"}, transition: '150ms'}}>
                        <Link to={'/pages/Archives'} style={{color: "#666",textDecoration: "none", padding: "10px", borderRadius: "10px"}}>
                          Archives
                        </Link>
                      </Typography>
                      <Typography sx={{fontSize: '1rem',color: "#aeaeae", padding: "10px"}}>
                        { '>'}
                      </Typography>
                      <Typography sx={{color: "#212121",textDecoration: "none", padding: "10px", borderRadius: "10px"}}>
                        {documentType}
                      </Typography>
                    </Box>
                    <Box sx={{display: "flex", justifyContent: "end", padding: '20px'}} className="dash-cards">
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      ></Typography>
                            <FormControl variant="standard">
                            <TextField
                                value={search}
                                className = "table-input"
                                size="small"
                                variant="outlined"
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                placeholder: "Description, Document Name",
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <SearchIcon />
                                    </InputAdornment>
                                ),
                                }}
                            />
                            </FormControl>
                        </Box>
                        <Box sx={{overflow: "auto", height: "100%"}}>

                        <TableContainer
                              className="table-main"
                              sx={{height: loading ? '' : "76%",maxHeight: "76%", pl: "20px", pr: "20px", tableLayout: "fixed" }}
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
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "0",
                                      }}>{filter ?  limitFilterText(filter, 14): "Document Name"}<FilterAltIcon className={filter || open1 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open1 ? 'filter1' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={open1 ? 'true' : undefined}
                                      onClick={(e) => handleFilter(e, 1)}/></Typography>
                                      
                                    </TableCell>
                                    <Menu
                                      sx={{height: "100%"}}
                                      id="filter1"
                                      anchorEl={anchorEl1}
                                      open={open1}
                                      onClose={(e) => handleFilterClose(e, 1)}
                                      MenuListProps={{
                                        'aria-labelledby': 'filter1',
                                      }}
                                    >
                                      <Box sx={{height: "100%", padding: "20px"}}>
                                        <Autocomplete
                                          size="small"
                                          defaultValue={filter}
                                          id="combo-box-demo"
                                          onChange={(e) => setFilter(e.target.innerText == undefined ? "" : e.target.innerText)}
                                          options={filteredOptionsName.map((option) => option)}
                                          sx={{ width: 250, maxHeight: "100px" }}
                                          renderInput={(params) => <TextField onChange={(e) => setFilter(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Document Name" />}
                                        />
                                      </Box>
                                      
                                    </Menu>
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
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "0"
                                      }}> {filter8 ?  limitFilterText(filter8, 14): "Document Type"}<FilterAltIcon className={filter8 || open2 ? "filter-icon active" : "filter-icon"} aria-label="filter2" aria-controls={open2 ? 'filter2' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={open2 ? 'true' : undefined}
                                      onClick={(e) => handleFilter(e,2)}/></Typography>
                                    </TableCell>
                                    <Menu
                                      id="filter2"
                                      anchorEl={anchorEl2}
                                      open={open2}
                                      onClose={(e) => handleFilterClose(e, 2)}
                                      MenuListProps={{
                                        'aria-labelledby': 'filter2',
                                      }}
                                    >
                                      <Box sx={{height: "100%", padding: "20px"}}>
                                        <Autocomplete
                                          size="small"
                                          defaultValue={filter8}
                                          id="combo-box-demo"
                                          onChange={(e) => setFilter8(e.target.innerText == undefined ? "" : e.target.innerText)}
                                          options={filteredOptionsDocType.map((option) => option)}
                                          sx={{ width: 250, maxHeight: "100px" }}
                                          renderInput={(params) => <TextField onChange={(e) => setFilter8(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Document Type" />}
                                        />
                                      </Box>
                                    </Menu>

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
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "0"
                                      }}> {filter2 ?  limitFilterText(filter2, 14): "Received By"}<FilterAltIcon className={filter2|| open3 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open3 ? 'filter1' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={open3 ? 'true' : undefined}
                                      onClick={(e) => handleFilter(e, 3)}/></Typography>
                                    </TableCell>
                                    <Menu
                                      id="filter2"
                                      anchorEl={anchorEl3}
                                      open={open3}
                                      onClose={(e) => handleFilterClose(e, 3)}
                                      MenuListProps={{
                                        'aria-labelledby': 'filter2',
                                      }}
                                    >
                                      <Box sx={{height: "100%", padding: "20px"}}>
                                        <Autocomplete
                                          size="small"
                                          defaultValue={filter2}
                                          id="combo-box-demo"
                                          onChange={(e) => setFilter2(e.target.innerText == undefined ? "" : e.target.innerText)}
                                          options={filteredOptionsReceive.map((option) => option)}
                                          sx={{ width: 250, maxHeight: "100px" }}
                                          renderInput={(params) => <TextField onChange={(e) => setFilter2(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Received By" />}
                                        />
                                      </Box>
                                    </Menu>

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
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "0"
                                      }}> {filter9 ?  limitFilterText(filter9, 14): "Office/Contact"}<FilterAltIcon className={filter9|| open4 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open4 ? 'filter1' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={open4 ? 'true' : undefined}
                                      onClick={(e) => handleFilter(e, 4)}/></Typography>
                                    </TableCell>
                                    <Menu
                                      id="filter2"
                                      anchorEl={anchorEl4}
                                      open={open4}
                                      onClose={(e) => handleFilterClose(e, 4)}
                                      MenuListProps={{
                                        'aria-labelledby': 'filter2',
                                      }}
                                    >
                                      <Box sx={{height: "100%", padding: "20px"}}>
                                        <Autocomplete
                                          size="small"
                                          defaultValue={filter2}
                                          id="combo-box-demo"
                                          onChange={(e) => setFilter9(e.target.innerText == undefined ? "" : e.target.innerText)}
                                          options={filteredOptionsfromDep.map((option) => option)}
                                          sx={{ width: 250, maxHeight: "100px" }}
                                          renderInput={(params) => <TextField onChange={(e) => setFilter9(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Office/Contact Person" />}
                                        />
                                      </Box>
                                    </Menu>

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
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "0"
                                      }}> {filter10 ? dayjs(filter10).format('MM/DD/YYYY').toString() : filter4? "This Year" : filter5? "This Month" :   filter6 ? "This Day" : "Date Received"}<FilterAltIcon className={filter10|| filter4 || filter5 || filter6 || open5 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open5 ? 'filter1' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={open5 ? 'true' : undefined}
                                      onClick={(e) => handleFilter(e, 5)} /></Typography>
                                    </TableCell>
                                    <Menu
                                      id="filter2"
                                      anchorEl={anchorEl5}
                                      open={open5}
                                      onClose={(e) => handleFilterClose(e, 5)}
                                      MenuListProps={{
                                        'aria-labelledby': 'filter2',
                                      }}
                                    >
                                      <Box sx={{height: "100%", padding: "20px"}}>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                          <DatePicker format="MM/DD/YYYY" value={dayjs(filter10)} label="Basic date picker" onChange={(e) => setFilter10(e)}/>
                                          <Button onClick={(e) => setFilter10("")} sx={{fontSize: "0.9rem", textTransform: "none"}}>Clear date</Button>
                                        </Box>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                          <FormControlLabel control={<Checkbox checked={filter4}  onChange={(e) => setFilter4(!filter4)}/>} label="This Year"/>
                                          <FormControlLabel control={<Checkbox checked={filter5}  onChange={(e) => setFilter5(!filter5)}/>} label="This Month"/>
                                          <FormControlLabel control={<Checkbox checked={filter6}  onChange={(e) => setFilter6(!filter6)}/>} label="This Day"/>
                                        </Box>
                                      </Box>
                                    </Menu>
                                  </TableRow>
                                </TableHead>
                                <TableBody sx={{ height: "100%" }}>
                                  {filteredData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                      <>
                                      <TableRow role="checkbox" tabIndex={-1} key={row.uID} sx={{ cursor: "pointer", userSelect: "none", height: "50px", background: "#F0EFF6",'& :last-child': {borderBottomRightRadius: "10px", borderTopRightRadius: "10px"} ,'& :first-child':  {borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px"} }} onClick={() => displayFileInfo(row.Type == undefined ? row.document_Type: row.Type, row.date_Received, row.received_By, row.fromDep, row.fromPer, row.Description, archiveImage.find(item => item.uID == row.uID)?.file_Name, row.uID, row.id)}>
                                        <TableCell className={fileInfo.uID == row.uID ? 'table-cell active' : 'table-cell'} align="left"> {row.document_Name} </TableCell>
                                        <TableCell className={fileInfo.uID == row.uID ? 'table-cell active' : 'table-cell'} align="left"> {row.Type == undefined || row.Type == "" ? row.document_Type : row.Type} </TableCell>
                                        <TableCell className={fileInfo.uID == row.uID ? 'table-cell active' : 'table-cell'} align="left"> {row.received_By} </TableCell>
                                        <TableCell className={fileInfo.uID == row.uID ? 'table-cell active' : 'table-cell'} align="left"> {row.fromDep == undefined ? row.fromPer : row.fromDep} </TableCell>
                                        <TableCell className={fileInfo.uID == row.uID ? 'table-cell active' : 'table-cell'} align="left"> {row.date_Received} </TableCell>
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
                                  Add archived documents.
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <TablePagination
                              className="table-pagination"
                              rowsPerPageOptions={[5, 10, 25, 100]}
                              component="div"
                              count={filteredData.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                                                      
                        </Box>
                     </Card>
                </Grid>
                <SwipeableDrawer
                  anchor={'right'}
                  open={openPull}
                >
                  <Box sx={{padding: "10px", display: "flex", justifyContent: 'start'}}><ClearIcon sx={{fontSize: "3rem"}} onClick={closePullTab}/></Box>
                  <Card className='dash-cards2' sx={{height: "100vh", padding: "20px", overflowY: "auto"}}>
                            {fileInfo ? (
                                <>
                                
                            <CardMedia sx={{height: 200, borderRadius: "5px", objectFit: "contain"}} image={fileImage}/>
                            <CardContent sx={{p: 0}}>
                                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <Button className='doughnut-button' onClick={() => openFile(fileInfo.uID)}>View File</Button>
                                </Box>
                                <Divider/>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "500"}}>File Details</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Type</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileType}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Date Received</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileDate}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Received By</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileReceivedBy}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Office/Dept</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileFromDep}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Contact Person</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileFromPer}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Description</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileDesc}</Typography>
                                </Box>
                                <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center", mt: "20px"}}>
                                    <Button startIcon={<RestorePageIcon/>} variant='outlined' color='success' sx={{textTransform: "none"}} onClick={() => restoreDoc(fileInfo.uID)}>Restore</Button>
                                </Box>
                                
                            </CardContent></>): 
                            (<div className="nothing-holder">
                            <img className="noresult" src={noresult} />
                            <div className="nothing">No Document Selected</div>
                            <div className="nothing-bottom">
                                Click a document to view their details
                            </div>
                            </div>)}
                            
                        </Card>
                </SwipeableDrawer>
                <Hidden mdDown>
                    <Grid item sm={6} md={4} lg={3} xl={3} sx={{right: "-100%"}}>
                        <Card className='dash-cards2' sx={{height: "100%",maxHeight: "740px", padding: "20px", overflowY: "auto"}}>
                            {fileInfo ? (
                                <>
                            <CardMedia sx={{height: 200, borderRadius: "5px", objectFit: "contain"}} image={fileImage}/>
                            <CardContent sx={{p: 0}}>
                                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <Button className='doughnut-button' onClick={() => openFile(fileInfo.uID)}>View File</Button>
                                </Box>
                                <Divider/>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "500"}}>File Details</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Type</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileType}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Date Received</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileDate}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Received By</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileReceivedBy}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Office/Dept</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileFromDep}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Contact Person</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileFromPer}</Typography>
                                </Box>
                                <Box sx={{mt: "20px"}}>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Description</Typography>
                                    <Typography sx={{fontWeight: "300", fontSize: "0.9rem"}}>{fileDesc}</Typography>
                                </Box>
                                <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center", mt: "20px"}}>
                                    <Button startIcon={<RestorePageIcon/>} variant='outlined' color='success' sx={{textTransform: "none"}} onClick={() => restoreDoc(fileInfo.uID)}>Restore</Button>
                                </Box>
                                
                            </CardContent></>): 
                            (<div className="nothing-holder">
                            <img className="noresult" src={noresult} />
                            <div className="nothing">No Document Selected</div>
                            <div className="nothing-bottom">
                                Click a document to view their details
                            </div>
                            </div>)}
                            
                        </Card>
                    </Grid>
                </Hidden>
            </Grid>
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
                                <h2>Internal/External: </h2>
                                <p>{displayFile.Type === 'IC' ? "Internal Communication" : "External Communication"}</p>
                                </div>
                                <div className="details">
                                <h2>Received By: </h2>
                                <p>{displayFile.received_By}</p>
                                </div>
                                <div className="details">
                                <h2>Office/Dept: </h2>
                                <p>{displayFile.fromDep}</p>
                                </div>
                                <div className="details">
                                <h2>Contact Person: </h2>
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
                                <div className="details">
                                <h2>Status: </h2>
                                <p>{displayFile.Status}</p>
                                </div>
                            </div>
                            </div>
                            <div className="view-img">
                      { imageList.length !=0 && filePDF.length != 0 ?(
                        <TabContext value={tabValue}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
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
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                                  {imageList && (
                                    <>
                                      <Viewer fileUrl={`${port}/document_Files/${filePDF}`} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark" />
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
                                  <Typography sx={{mt: "5vh"}}>{fileDocx}</Typography>
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
                                  <Typography sx={{mt: "5vh"}}>{fileXlsx}</Typography>
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
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                          {imageList && (
                            <>
                              <Viewer fileUrl={`${port}/document_Files/${filePDF}`} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark" />
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
                              <Typography sx={{mt: "5vh"}}>{fileDocx}</Typography>
                              <Button component="label" onClick={(e) => handleDownload("docx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none"}}>
                                Download .docx File
                              </Button>
                            </Box>
                            
                          </> 
                      ) : fileXlsx.length !=0 ? (
                        <>
                          <Box sx={{width: "100%", height: '300px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                            <Typography sx={{mt: "5vh"}}>{fileXlsx}</Typography>
                            <Button component="label" onClick={(e) => handleDownload("xlsx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none"}}>
                              Download .xlsx File
                            </Button>
                          </Box>
                        </> 
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
      )
}

export default ArchiveMainTable