import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Autocomplete, Box, FormControl, Grid, ImageList, ImageListItem, InputAdornment, Paper, TextField, Tooltip } from "@mui/material";
import pdfIcon from "../Images/pdf.png";
import letter from "../Images/letter.png";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
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
  deleteObject,
} from "firebase/storage";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { auth, db, firestore, storage } from "../firebase";
import noresult from "../Images/noresults.png";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import Lightbox from "react-image-lightbox";
import docxViewIcon from '../Images/docxView.png'
import xlsxViewIcon from '../Images/xlsxView.png'
import { CloudDownload } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";

export default function MediaCard() {
  const port = "http://localhost:3001"
  axios.defaults.withCredentials = true
  // Firebase
  const storage = getStorage();
  //INPUTS
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [emptyResult, setEmptyResult] = useState(false);
  const [newName, setNewName] = useState("");
  const [template, setTemplate] = useState([]);
  const templateCollectionRef = collection(db, "documents");
  const uniqueID = uuid();
  const [imageUpload, setImageUpload] = useState(null);
  //submit loading
  const [sumbmit, setSumbmit] = useState(false);
  const templateListRef = ref(storage, "Templates/");
  const [templateList, setTemplateList] = useState([]);
  let q = query(templateCollectionRef, where("Remark", "==", "Template"));
  const [openAdd, setOpenAdd] = useState(false);
  const [openShowFile, setOpenShowFile] = useState(false);
  const [displayFile, setDisplayFile] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [filePDF, setFilePDF] = useState([]);
  const [fileDocx, setFileDocx] = useState([]);
  const [fileXlsx, setFileXlsx] = useState([]);
  const [fileExt, setFileExt] = useState([])
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

  useEffect(()=> {
    
    console.log(fileExt.find(item => item.uid == "60cd02cf-0ec8-4448-8537-b42906883f09"));
  }, [])

  
  const handleClickOpen = () => {
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpenAdd(false);
  };


  const [yearData, setYearData] = useState([])
  const getTemplate = async () => {
    const extArray = []
    const yearSet = new Set()
    const data = await axios.get(`${port}/getTemplates`);
    data.data.forEach((item) => {
      yearSet.add(new Date(item.date_Added).getFullYear())
      if (item.file_Name.endsWith('.pdf')){
        extArray.push({uid: item.name, image:"pdf"})
      }
      else if (item.file_Name.endsWith('.docx') || item.file_Name.endsWith('.doc')){
        extArray.push({uid: item.name, image:"docx"})
      }
      else if (item.file_Name.endsWith('.xlsx') || item.file_Name.endsWith('.xls')){
        extArray.push({uid: item.name, image:"xlsx"})
      }
    })
    setFileExt(extArray)
    
    if ([data.data.length] > 0) {
      setLoading(false);
      setEmptyResult(false);
      setYearData(Array.from(yearSet))
      fileExt && setTemplate(data.data.map((doc) => ({...doc, year: new Date(doc.date_Added).getFullYear()})));
    } else {
      setLoading(false);
      setEmptyResult(true);
    }
   
  };


  useEffect(() => {
    getTemplate();
  }, []);

  const createTemplate = async (e) => {
    if (imageUpload == null) return;
    e.preventDefault();
    setSumbmit(true);
    const formData = new FormData();
    formData.append(`files`, imageUpload)
    formData.append(`name`, newName)
    formData.append(`uID`, uniqueID)
    formData.append(`type`, imageUpload.name.endsWith('.pdf') ? "pdf" : imageUpload.name.endsWith('.doc') ? "docx": imageUpload.name.endsWith('.docx') ? "docx": imageUpload.name.endsWith('.xls') ? "xlsx" : imageUpload.name.endsWith('.xlsx') && "xlsx")
    try{
      await axios.post(`${port}/addTemplate`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      })  
    }catch(e){

    }
    toast.success('Successfully added')
    setSumbmit(false)
    handleClose();
    getTemplate();
  };

  const deleteTemplate = async (id, uID) => {
    Swal.fire({
      title: "Confrim Delete?",
      text: "The template will be deleted permanently.",
      icon: "info",
      iconColor: "#FF5600",
      showCancelButton: true,
      confirmButtonColor: "#FF5600",
      cancelButtonColor: "#888",
      confirmButtonText: "Delete doc",
      focusConfirm: true,
    }).then(async (result) => {
      if (result.value) {
        try{
          await axios.post(`${port}/deleteTemplate?uID=${uID}`)
        }catch(e){
          console.log(e.message);
        }
        getTemplate();
        toast.success('Deleted Successfully')
      }
    });
      
  };
  //Download
  const downloadTemp = async (id, name) => {
    const anchor = document.createElement('a');
    anchor.href = `${port}/templates/${name}`;
    anchor.download = name;
    anchor.target = '_blank';
    anchor.click();
  };

  


  const openFile = (id) => {
    setOpenShowFile(true);
    showFile(id);
  };


  const showFile = async (id) => {
    const data = await axios.get(`${port}/getTemplates`);
    data.data.forEach((item) => {
      if(item.uID == id){
        if (item.file_Name.endsWith('.pdf')){
          setFilePDF(`${port}/templates/${item.file_Name}`);
        }
        else if (item.file_Name.endsWith('.docx') || item.file_Name.endsWith('.doc')){
          setFileDocx({name: item.name, url: `${port}/templates/${item.file_Name}`});
        }
        else if (item.file_Name.endsWith('.xlsx') || item.file_Name.endsWith('.xls')){
          setFileXlsx({name: item.name, url: `${port}/templates/${item.file_Name}`});
        }
      }
    })
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
    const [search, setSearch] = useState("");

    const [rotation, setRotation] = useState(0);
  const refreshTable = () => {
    setRotation(rotation + 360);
    setTemplate([])
    setLoading(true)
    setEmptyResult(false)
    getTemplate()
  }

  return (
    <Paper className="template-bg" sx={{ width: "100%", overflow: "hidden", height: "100%", position: "relative" }}>
      <div><Toaster position="top-right" reverseOrder={false}/></div>
      <div className="monitoring-top">
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            style={{fontSize:windowWidth <= 320 && "0.8rem", fontWeight: "bold" }}
            onClick={handleClickOpen}
          >
            ADD NEW DOCUMENT
          </Button>
          <Typography sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Tooltip title={<Typography sx={{fontSize: "0.8rem"}}>Refresh</Typography>} arrow>
              <RefreshIcon sx={{fontSize: "35px",  transform: `rotate(${rotation}deg)`, transition: 'transform 1s'}} className="refresh-icon" onClick={refreshTable}/>
            </Tooltip>
          </Typography>
          </Box>
        <FormControl variant="standard">
            <TextField
              value={search}
              className = "Text-input"
              size="small"
              variant="outlined"
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                placeholder: "Folder Name",
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
      </div>
      {yearData.map((year) => {
        return(
          <>
            <Typography sx={{fontWeight: 'bold', fontSize: '1.2rem'}}>{year}</Typography>
            <Grid container sx={{marginBottom: "30px"}}>
              {template
                .filter((template) => {return search.toLowerCase() === '' ? template : template.name.toLowerCase().includes(search.toLowerCase())})
                .filter((template) => template.year == year)
                .map((template) => {
                return (
                  <Grid item xs={12} sm={windowWidth <= 768 ? 6 : 12} md={4} lg={4} justifyContent={'center'}>
                    <Box sx={{m: "10px"}}>
                      <Card
                        className="template-card"
                        sx={{
                          borderRadius: "10px",
                          "& .MuiCardContent-root:last-child": { paddingBottom: "0" },
                        }}
                      >
                        <CardMedia
                          className="template-card-bg"
                          component="img"
                          sx={{
                            height: 200,
                            objectFit: "contain",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            cursor: "pointer",
                            transition: "250ms",
                            ":hover": { padding: "10px" },
                          }}
                          image={template.type == "pdf" ? pdfIcon : template.type == "docx"? docxViewIcon : template.type == "xlsx" && xlsxViewIcon}
                          title={template.name}
                          onClick={() => openFile(template.uID)}
                        />
                        <CardContent sx={{ padding: 1 }}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            justifyContent={"center"}
                            display={"flex"}
                            fontFamily={"Lato"}
                            marginBottom={1}
                            fontWeight={"bold"}
                            sx={{ textDecoration: "underline" }}
                          >
                            {template.name}
                          </Typography>
                          <CardActions
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Button
                              size="medium"
                              sx={{
                                textTransform: "capitalize",
                                backgroundColor: "#FF6347",
                                padding: "5px 24px",
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                fontFamily: "Lato",
                                fontSize: "1rem",
                                borderRadius: "10px",
                                ":hover": { backgroundColor: "#212121" },
                              }}
                              onClick={() => downloadTemp(template.uID, template.file_Name)}
                            >
                              Download
                            </Button>
                            <Button
                              size="small"
                              sx={{
                                textTransform: "capitalize",
                                color: "#999999",
                                textDecoration: "underline",
                              }}
                              onClick={() => deleteTemplate(template.id, template.uID)}
                            >
                              Delete Template
                            </Button>
                          </CardActions>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )
      })}
      
      {loading ? (
        <div className="load-container2">
          <span className="loader"></span>
        </div>
      ) : (
        ""
      )}
      {emptyResult ? (
        <div className="nothing-holder2">
            <img className="noresult" src={noresult} />
            <div className="nothing">No Templates found</div>
            <div className="nothing-bottom">
              Add incoming or outgoing documents.
            </div>
          </div>
      ) : (
        ""
      )}

      <Dialog open={openAdd} fullWidth maxWidth="md">
        <DialogTitle className="dialogDisplayTitle">
          <div className="dialog-title">Add Document</div>
        </DialogTitle>
        <DialogContent className="form-body">
          <form action="" onSubmit={createTemplate}>
            <div className="form-top">

              <TextField
                error={newName == template.find(item => item.name == newName)?.name}
                className="Text-input"
                type="text"
                placeholder="Document Name"
                name="docuname"
                onChange={(event) => {
                  setNewName(event.target.value);
                }}
                required
                helperText={newName == template.find(item => item.name == newName)?.name ? "A template with the same name already exist." : ""}
              >

              </TextField>
            </div>
            <div className="right-holder">
              <div className="form-middle">
                <div className="file-upload">
                  <label htmlFor="file">File:</label>
                  <input
                    type="file"
                    name="file"
                    accept=".pdf, .doc, .docx, .xlsx, .xls"
                    capture="environment"
                    onChange={(e) => setImageUpload(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="form-bottom">
                <div className="form-submit-cancel">
                  <div className="submit-cancel">
                    <button
                      type="button"
                      className="form-cancel"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    {sumbmit ? (
                      <button disabled={sumbmit} type="submit" className="form-submit2">
                        <div className="load-container3">
                          <span class="loader2"></span>
                        </div>
                      </button>
                    ) : (
                      <button type="submit" className="form-submit">
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openShowFile}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { minHeight: "90%" } }}
      >
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">View Template</div>
            <div className="dialog-title-close">
              <button onClick={closeFile}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay" sx={{ mineight: "100%" }}>
                      {filePDF.length != 0 ? (
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
                              <Typography sx={{mt: "5vh"}}>{fileDocx.name}</Typography>
                              <Button component="label" onClick={(e) => handleDownload("docx")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none"}}>
                                Download .docx File
                              </Button>
                            </Box>
                            
                          </> 
                      ) : fileXlsx.length !=0 && (
                        <>
                          <Box sx={{width: "100%", height: '300px', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                            <Typography sx={{mt: "5vh"}}>{fileXlsx.name}</Typography>
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
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
