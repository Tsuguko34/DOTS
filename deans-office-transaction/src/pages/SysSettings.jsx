import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import CircleIcon from "@mui/icons-material/Circle";
import Grid from "@mui/material/Grid";
import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Dialog, DialogContent, Fade, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, Menu, MenuItem, OutlinedInput, Paper, Popper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import styled from "styled-components";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import userPic from '../Images/user.png'
import LoadingButton from '@mui/lab/LoadingButton';
import { auth, db, storage } from "../firebase";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getMetadata, listAll, ref, uploadBytes } from "firebase/storage";
import SaveIcon from '@mui/icons-material/Save';
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { EmailAuthProvider, createUserWithEmailAndPassword, reauthenticateWithCredential, signInWithEmailAndPassword, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { UserAuth } from "../components/AuthContext";
import { Navigate, useNavigate } from "react-router";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import logo from '../Images/cict-logo.png';
import sbbg from '../Images/pimentel.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import { v4 as uuid } from "uuid";
import axios from "axios";
import Textarea from '@mui/joy/Textarea';

function SysSettings() {
  const port = "http://localhost:3001"
  axios.defaults.withCredentials = true
  const uniqueID = uuid();
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
  const navigate = useNavigate()
  const [profilePic, setProfilePic] = useState(null);
  const [initialprofilePic, setInitialProfilePic] = useState(null);
  const [imageDis, setImageDis] = useState(userPic);
  const [date, setDate] = useState("");
  const [userInfo, setUserInfo] = useState([])
  const [docID, setDocID] = useState("")
  const [name, setName] = useState("")
  const [initialname, setInitialName] = useState("")
  const [load, setLoad] = useState(false)
  const [load2, setLoad2] = useState(false)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disableForm, setDisableForm] = useState(false)
  const [disableFormSub, setDisableFormSub] = useState(false)
  const [userHolder, setuserHolder] = useState(null);
  const [backdrop, setBackdrop] = useState(true)
  const [samePass, setSamePass] = useState(false)
  const [wrongPass, setWrongPass] = useState(false)
  const [notSame, setNotSame] = useState(false)
  const [passRequired, setPassRequired] = useState(false)
  const [user, setUser] = useState([]);
  useEffect(() => {
    setDate(dayjs().format("MMMM D, YYYY h:mm A"));
    setInterval(() => {
      setDate(dayjs().format("MMMM D, YYYY h:mm A"));
    }, 1000);
  });

  const [value, setValue] = useState('1');

  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [userList, setUserList] = useState([])
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if(name == initialname && imageDis == initialprofilePic && oldPassword == "" && newPassword == "" && confirmPassword == ""){
      setDisableFormSub(true)
    }else{
      setDisableFormSub(false)
    }
    
    if(oldPassword != "" || newPassword != "" || confirmPassword != ""){
      setPassRequired(true)
    }else{
      setPassRequired(false)
    }
  }, [name, imageDis, oldPassword, newPassword, confirmPassword])

  const getUser = async() => {
    try{
      await axios.get(`${port}/getUser`).then((data) => {
        if(data.status == 200){
          setUser(data.data[0])
        }
      })
    }catch(e){
      console.log(e);
    }
  }
  const getUserList = async() => {
    try{
      await axios.get(`${port}/getUsers`).then((data) => {
        setUserList(data.data)
      })
    }catch(e){
      console.log(e);
    }
  }
  
  useEffect(() => {
    getUser()
    getUserList()
  },[])

  useEffect(() => {
    const getProfile = async() => {
      setLoad(true)
      setImageDis(`${port}/profile_Pictures/${user.profilePic}`)
      setInitialProfilePic(`${port}/profile_Pictures/${user.profilePic}`)
      setName(user.full_Name)
      setInitialName(user.full_Name)
      setDocID(user.uID)
      setLoad(false)
      Swal.close()
    }
    getProfile()
  }, [user])

  const [dropdowns, setDropdowns] = useState([])

  useEffect(() => {
    getDropdowns()
  }, [])



  const [office, setOffice] = useState([])
  const [initialOffice, setInitialOffice] = useState([])
  const [office2, setOffice2] = useState([])

  const [categories, setCategories] = useState([])
  const [initialcategories, setInitialCategories] = useState([])
  const [categories2, setCategories2] = useState([])

  const [student, setStudent] = useState([])
  const [initialstudent, setInitialStudent] = useState([])
  const [student2, setStudent2] = useState([])

  const [faculty, setFaculty] = useState([])
  const [initialfaculty, setInitialFaculty] = useState([])
  const [faculty2, setFaculty2] = useState([])

  const [hire, setHire] = useState([])
  const [initialhire, setInitialHire] = useState([])
  const [hire2, setHire2] = useState([])
  
  const [textSubmit, settexSubmit] = useState(false)
  const [textDisabled, settexDisabled] = useState(true)
  

  const handleTextAreaSubmit = async() => {
    settexSubmit(true)
    settexDisabled(true)
    try{
      if (JSON.stringify(office) != JSON.stringify(initialOffice)){
        const nonBlankLinesArray = office.filter(line => line.trim() !== '');
        const dataToSend = {
          office : nonBlankLinesArray
        }
        await axios.post(`${port}/addDropdowns?type=Office`, dataToSend)
      }
      if (JSON.stringify(categories) != JSON.stringify(initialcategories)){
        const nonBlankLinesArray = categories.filter(line => line.trim() !== '');
        const dataToSend = {
          categories : nonBlankLinesArray
        }
        await axios.post(`${port}/addDropdowns?type=Categories`, dataToSend)
      }
      if (JSON.stringify(student) != JSON.stringify(initialstudent)){
        const nonBlankLinesArray = student.filter(line => line.trim() !== '');
        const dataToSend = {
          student : nonBlankLinesArray
        }
        await axios.post(`${port}/addDropdowns?type=Student`, dataToSend)
      }
      if (JSON.stringify(faculty) != JSON.stringify(initialfaculty)){
        const nonBlankLinesArray = faculty.filter(line => line.trim() !== '');
        const dataToSend = {
          faculty : nonBlankLinesArray
        }
        await axios.post(`${port}/addDropdowns?type=Faculty`, dataToSend)
      }
      if (JSON.stringify(hire) != JSON.stringify(initialhire)){
        const nonBlankLinesArray = hire.filter(line => line.trim() !== '');
        const dataToSend = {
          hire : nonBlankLinesArray
        }
        await axios.post(`${port}/addDropdowns?type=Hire`, dataToSend)
      }
      settexSubmit(false)
      toast.success("Dropdowns changed successfully.")
    }catch(e){
      console.log(e.message);
      settexSubmit(false)
      toast.error("Something went wrong.")
    }
    getDropdowns()
  }


  useEffect(() => {
    setOffice2(office.join('\n'))
  }, [office])
  
  useEffect(() => {
    setCategories2(categories.join('\n'))
  }, [categories])

  useEffect(() => {
    setStudent2(student.join('\n'))
  }, [student])

  useEffect(() => {
    setFaculty2(faculty.join('\n'))
  }, [faculty])

  useEffect(() => {
    setHire2(hire.join('\n'))
  }, [hire])

  useEffect(() => {
    if (JSON.stringify(office) != JSON.stringify(initialOffice) || JSON.stringify(categories) != JSON.stringify(initialcategories) || JSON.stringify(student) != JSON.stringify(initialstudent)
        || JSON.stringify(faculty) != JSON.stringify(initialfaculty) || JSON.stringify(hire) != JSON.stringify(initialhire)){
        settexDisabled(false)
    }else{
        settexDisabled(true)
    }
  }, [office, categories, student, faculty, hire])

  const getDropdowns = async() => {
    try{
      await axios.get(`${port}/getDropdowns`).then((data) => {
        setOffice(data.data.filter(item => item.option_For == "Office").map(filteredItem => filteredItem.option))
        setInitialOffice(data.data.filter(item => item.option_For == "Office").map(filteredItem => filteredItem.option))
        setCategories(data.data.filter(item => item.option_For == "Categories").map(filteredItem => filteredItem.option))
        setInitialCategories(data.data.filter(item => item.option_For == "Categories").map(filteredItem => filteredItem.option))
        setStudent(data.data.filter(item => item.option_For == "Student").map(filteredItem => filteredItem.option))
        setInitialStudent(data.data.filter(item => item.option_For == "Student").map(filteredItem => filteredItem.option))
        setFaculty(data.data.filter(item => item.option_For == "Faculty").map(filteredItem => filteredItem.option))
        setInitialFaculty(data.data.filter(item => item.option_For == "Faculty").map(filteredItem => filteredItem.option))
        setHire(data.data.filter(item => item.option_For == "Hire").map(filteredItem => filteredItem.option))
        setInitialHire(data.data.filter(item => item.option_For == "Hire").map(filteredItem => filteredItem.option))
      })
    }catch(e){
      console.log(e.message);
    }
  }

  return (
    <section className="monitoring">
      <div><Toaster position="bottom-center" reverseOrder={false}/></div>
      <div className="page-title">
        <p>Dean's Office Transaction</p>
        <p>System Settings</p>
        <div className="page-desc">
          Dean's office transaction system settings.
        </div>
      </div>
      <div className="monitoring-content-holder">
        <Box className="settings-body" sx={{p: "16px", borderRadius: "10px"}}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Dropdowns" value="1" />
              </TabList>
            </Box>
            <TabPanel value="1">
                <Box component={"div"} sx={{display: 'flex', justifyContent: "space-between", paddingBottom: "10px"}}>
                    <LoadingButton onClick={handleTextAreaSubmit} disabled={textDisabled} loading={textSubmit}  variant="contained" type="submit" sx={{ml: "20px"}} loadingPosition="end" endIcon={<SaveIcon/>}>
                      <span>Save</span>
                    </LoadingButton>
                </Box>
                <Box component={"div"} sx={{maxHeight: "1000px", overflowY: "auto"}}>
                  <Grid container sx={{display: "flex", flexDirection: "row"}}>
                    <Grid item xs={12} md={6} lg={6} xl={4} sx={{padding: "10px"}}>
                      <Typography sx={{fontWeight: "700",color: "#888888"}}>Office/Departments</Typography>
                      <Textarea value={office2} placeholder="Office/Departments Dropdowns..." size="md" minRows={10} maxRows={10} onChange={(e) => setOffice(e.target.value.split('\n'))}>
                      </Textarea>
                    </Grid>
                    {/* <Grid item xs={12} md={6} lg={6} xl={4} sx={{padding: "10px"}}>
                      <Typography sx={{fontWeight: "700",color: "#888888"}}>Other Documents // Categories</Typography>
                      <Textarea value={categories2} placeholder="Categories Dropdowns..." size="md" minRows={10} maxRows={10} onChange={(e) => setCategories(e.target.value.split('\n'))}>
                      </Textarea>
                    </Grid> */}
                    <Grid item xs={12} md={6} lg={6} xl={4} sx={{padding: "10px"}}>
                      <Typography sx={{fontWeight: "700",color: "#888888"}}>Other Documents // Student Documents</Typography>
                      <Textarea value={student2} placeholder="Student Documents Dropdowns..." size="md" minRows={10} maxRows={10} onChange={(e) => setStudent(e.target.value.split('\n'))}>
                      </Textarea>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={4} sx={{padding: "10px"}}>
                      <Typography sx={{fontWeight: "700",color: "#888888"}}>Other Documents // Faculty Documents</Typography>
                      <Textarea value={faculty2} placeholder="Faculty Documents Dropdowns..." size="md" minRows={10} maxRows={10} onChange={(e) => setFaculty(e.target.value.split('\n'))}>
                      </Textarea>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={4} sx={{padding: "10px"}}>
                      <Typography sx={{fontWeight: "700",color: "#888888"}}>Other Documents // New Hire Documents</Typography>
                      <Textarea value={hire2} placeholder="New Hire Documents Dropdowns..." size="md" minRows={10} maxRows={10} onChange={(e) => setHire(e.target.value.split('\n'))}>
                      </Textarea>
                    </Grid>
                  </Grid>
                </Box>
            </TabPanel>
          </TabContext>
          </Box>
      </Box>
      </div>

    </section>
  );
}

export default SysSettings;
