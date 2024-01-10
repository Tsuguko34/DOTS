import React, { useEffect, useState } from 'react'
import './Pages.css'
import { Box, Button, Card, Dialog, DialogContent, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import FolderDay from "../Images/FolderDay.png"
import FolderNight from "../Images/FolderNight.png"
import { addDoc, collection, getDocs, query } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { Link } from 'react-router-dom'
import noresult from "../Images/noresults.png";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import toast, { Toaster } from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios'
function ArchiveTable() {
  const port = "http://localhost:3001"
  axios.defaults.withCredentials = true
   //Loading
   const [loading, setLoading] = useState(true);
   const [emptyResult, setEmptyResult] = useState(false);
   //Window Width
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

  useEffect(() => {
    getUser()
  }, [])

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const getUser = async() => {
    try{
      await axios.get(`${port}/getUser`).then((data) => {
        if(data.status == 200){
          setUser(data.data[0])
        }
      })
      await axios.get(`${port}/getUsers`).then((data) => {
        setUsers(data.data)
      })
    }catch(e){
      console.log(e.message);
    }
  }

  const documentsRef = collection(db, "archive")
  const [buttonData, setButtonData] = useState([])
  const [yearData, setYearData] = useState([])
 

  const getStatus = async() => {
    const data = await axios.get(`${port}/getArchives`)
    if(data.data.success == false){
      toast.error("There was an error while retrieving the archives")
    }
    else{
      const buttonSet = new Set()
      const yearSet = new Set()
      const updatedButtonSet = new Set()
      data.data.forEach((doc) => {
        const whatDoc = doc.document_Type
        const whatYear = new Date(doc.date_Received).getFullYear()
        const elementToCheck = {Type : whatDoc, Year : whatYear}
        if(whatDoc){
          if(user.role == "Faculty"){
            if(doc.forwarded_By == user.uID || doc.forward_To == user.uID || doc.accepted_Rejected_By == user.uID || user.full_Name.includes(doc.fromPer) || doc.forward_To.includes("Faculty") || (doc.forward_To.includes("All") && !doc.forward_To.includes(user.uID))){
              if (buttonSet.size === 0 || ![...buttonSet].some(button => button.Type === whatDoc)) {
                buttonSet.add({ Type: whatDoc, Year: whatYear });
                updatedButtonSet.add({ Type: whatDoc, Year: whatYear });
              } else {
                buttonSet.forEach((button) => {
                  if (button.Type === whatDoc && button.Year !== whatYear) {
                    updatedButtonSet.add({ Type: whatDoc, Year: whatYear });
                  }
                });
              }
              yearSet.add(whatYear)
            }
          }else{
            if (buttonSet.size === 0 || ![...buttonSet].some(button => button.Type === whatDoc)) {
              buttonSet.add({ Type: whatDoc, Year: whatYear });
              updatedButtonSet.add({ Type: whatDoc, Year: whatYear });
            } else {
              buttonSet.forEach((button) => {
                if (button.Type === whatDoc && button.Year !== whatYear) {
                  updatedButtonSet.add({ Type: whatDoc, Year: whatYear });
                }
              });
            }
            yearSet.add(whatYear)
          }
          
        }
      })
      const buttonArray = Array.from(updatedButtonSet)
      const yearArray = Array.from(yearSet)
      if(buttonArray.length > 0 || yearArray.length > 0){
        setEmptyResult(false)
      }else{
        setEmptyResult(true)
      }
      yearArray.sort((a, b) => b - a);
      setButtonData(buttonArray)
      setYearData(yearArray)
      setLoading(false)
    }
    
  }

  useEffect(() => {
    getStatus()
  }, [users])

  const [openFilter, setOpenFilter] = useState(false);
  const [uniqueValuesArray, setUniqueValuesArray] = useState([]);
  const [years, setYears] = useState([]);
  const [from, setFrom] = useState([]);
  const filterOpen = async () => {
    const fetchData = async () => {
      const myCollectionRef = collection(db, "documents");
      const myQuery = query(myCollectionRef);

      const querySnapshot = await getDocs(myQuery);
      const uniqueValues = new Set();

      querySnapshot.forEach((doc) => {
        if(doc.data().document_Type != undefined){
          const fieldValue = doc.data().document_Type;
          uniqueValues.add(fieldValue);
        }
      });
      const uniqueValuesArray = Array.from(uniqueValues);
      setUniqueValuesArray(uniqueValuesArray);
    };
    await fetchData();
    setOpenFilter(true);
  };

  const filterClose = () => {
    setOpenFilter(false)
  }

  //Create Folder
  const [sumbmit, setSumbmit] = useState(false);
  const [sameType, setSameType] = useState(false);
  const [alreadyHas, setAlreadyHas] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dType1, setDType1] = useState("");
  const [dType2, setDType2] = useState("");
  const createFolder = async(e) => {
    const archiveRef = collection(db, "archive")
    e.preventDefault()
    setSumbmit(true)
    setSubmitting(true)
    if(dType1 != "" && dType2 != ""){
      setSameType(true)
      setSumbmit(false)
      setAlreadyHas(false)
      setSubmitting(false)
    }else if(buttonData.some((item) => item.toLowerCase() == dType1.toLowerCase() || buttonData.some((item) => item.toLowerCase() == dType2.toLowerCase()))){
      setAlreadyHas(true)
      setSameType(false)
      setSumbmit(false)
      setSubmitting(false)
    }
    else{
      const words = dType1 == "" ? dType2.split(' ') : dType1.split(' ');
      const capitalize = words.map((word) => { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();} )
      const finalWord = capitalize.join(' ')
      await addDoc(archiveRef, {
        Folder: "Filler",
        document_Type: finalWord
      })
      setSameType(false)
      setSumbmit(false)
      setAlreadyHas(false)
      setSubmitting(false)
      getStatus()
      toast.success("Folder created.")
      filterClose()
    }
  }

  const [search, setSearch] = useState('')


  return (
    <>
    <Toaster position='bottom-center'/>
      <div className={!emptyResult ?"logo-Bg" : ''}>
        <Stack
          direction="row"
          spacing={2}
          style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px" }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
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
        </Stack>
        {yearData.map((year) => {
          return(
            <>
              <Typography sx={{fontSize:'1.5rem', fontWeight:'bold', color: "#FF9944", borderBottom: "3px solid", borderImage: "linear-gradient(to right, #FF9944 30%, transparent 100%)", borderImageSlice: "1"}}>{year}</Typography>
              <Grid container xs={12} sx={{width: "100%", padding: "20px", zIndex: "2", position: "relative"}}>
                {buttonData.filter(item => item.Type.toLowerCase().includes(search.toLowerCase())).filter(item => item.Year == year).map((buttonData) => {
                  return(
                      <Grid item xs={windowWidth >= 375 ? 6 : 12} sm={4} md={3} lg={3} sx={{mt: "20px"}}>
                        <Link to={`./pages/ArchiveMaintable/${buttonData.Type == "IPCR/OPCR" ? "IPCR-OPCR": buttonData.Type}/${year}`}>
                          <Card sx={{backgroundColor: "transparent", boxShadow: "none", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer", userSelect: "none"}}>
                            <div className="archive-image">
                              <img alt="Folder Image" />
                            </div>
                            <div className="archive-title">
                              <Typography sx={{fontWeight: "bold", fontSize: "1rem", maxWidth: "50px", display: "flex", justifyContent: 'center', alignItems: "center"}}>{buttonData.Type}</Typography>
                            </div>
                          </Card>
                        </Link>
                      </Grid>
                  )
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
              <div className="nothing">No Archived Documents found</div>
              <div className="nothing-bottom">
                No documents has been archived.
              </div>
            </div>
        ) : (
          ""
        )}
      </div> 
      <Dialog open={openFilter} fullWidth maxWidth="sm">
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">Filter</div>
            <div className="dialog-title-close">
              <button onClick={filterClose}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay">
          <form action="" onSubmit={createFolder}>
          <FormControl variant="outlined" sx={{ marginTop: 1, width: "100%" }}>
            <InputLabel id="Document Type" className="table-filter">Document Type</InputLabel>
            <Select
              required={!dType2}
              size='medium'
              labelId="Document Type"
              id="demo-simple-select"
              label="Document Type"
              onChange={(e) => setDType1(e.target.value)}
              className="table-filter"
            >
              <MenuItem value={""}>Clear Filter</MenuItem>
              {uniqueValuesArray.map((value, index) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{mt: "20px",mb: "20px",width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Typography className='or' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>Or</Typography>
          </Box>
          <FormControl variant="outlined" sx={{width: "100%" }}>
            <TextField
              required = {!dType1}
              className = "Text-input"
              variant="outlined"
              onChange={(e) => setDType2(e.target.value)}
              InputProps={{
                placeholder: "Collection Name",
              }}
            />
          </FormControl>
          {sameType ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FAA0A0", border: '2px solid red', padding: '10px', color: "white", fontWeight: "bold"}}>
              Both fields cannot be filled up at the same time.
          </Typography>: ''}
          {alreadyHas ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FAA0A0", border: '2px solid red', padding: '10px', color: "white", fontWeight: "bold"}}>
              A folder with the same name already exist.
          </Typography>: ''}
          {submitting ? <Box sx={{display: 'flex', width: "100%" , justifyContent: "center", alignItems: "center"}}><CircularProgress /></Box> : ''}
              <Box sx={{display: "flex", justifyContent: "space-between"}}></Box>
          <div className="form-bottom">
                <div className="form-submit-cancel">
                  <div className="submit-cancel">
                    <button
                      type="button"
                      className="form-cancel"
                      onClick={filterClose}
                    >
                      Cancel
                    </button>
                    {sumbmit ? (
                      <button type="submit" className="form-submit2">
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
            </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ArchiveTable