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
import { Select } from "@mui/base";

function Settings() {
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
  

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const { signout } = UserAuth();
 
  const onImageChange = (e) => {
    const file = e.target.files[0];
      const allowedFileTypes = [".png", ".jpg", ".jpeg"];
      if(file){
        const extension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
        if(allowedFileTypes.includes(`.${extension}`)){
          setProfilePic(e.target.files[0])
          const reader = new FileReader();
          reader.onload = () => {
          setImageDis(reader.result);
        };
        reader.readAsDataURL(file);
        }
        else{
          Swal.fire({text: "File must be a .png, .jpg, .jpeg", confirmButtonColor: "#FF9944"})
        }
      } 

  }

  
  const editName = async() => {
    setLoad2(true)
    setDisableForm(true)
    toast.loading("Please wait...")
    const editNamed = {
      full_Name: name,
    }
    try{
      await axios.put(`${port}/editProfile?request=Name&uID=${user.uID}`, editNamed).then((success) => {
        if(success.status == 200){
          setLoad2(false)
          toast.dismiss()
          toast.success('Successfully edited. refreshing page')
          setDisableForm(false)
          setInterval(() => {
            window.location.reload()
          }, 1000)
        }
      })
    }catch(e){
      console.log(e.message);
    }
  }


  const [newEmail, setNewEmail] = useState("")
  const [emailPass, setEmailPass] = useState("")
  const [wrongEmailPass, setWrongEmailPass] = useState(false)
  const [wrongEmail, setWrongEmail] = useState(false)

  const editEmail = async(e) => {
    e.preventDefault()
    setLoad2(true)
    toast.loading("Please wait...")
    setDisableForm(true)
    const emailEdit = {
      email: newEmail,
      pass: emailPass
    }
    if(!userList.find(item => item.email == newEmail)){
        try{
          await axios.put(`${port}/editProfile?request=Email&uID=${user.uID}`, emailEdit).then((success) => {
            if(success.status == 200){
              if(success.data.success == true){
                setLoad2(false)
                toast.dismiss()
                toast.success('Successfully edited. refreshing page')
                setDisableForm(false)
                setInterval(() => {
                  window.location.reload()
                }, 1000)
              }else if(success.data.success == false){
                setWrongEmailPass(true)
                setDisableForm(false)
                setLoad2(false)
                toast.dismiss()
                toast.error("Something went wrong. Try again")
              }  
            }
          })
        }catch(e){
          console.log(e.message);
        }
    }else if(userList.find(item => item.email == newEmail)){
      setLoad2(false)
      setWrongEmail(true)
      setDisableForm(false)
      toast.dismiss()
      toast.error("Something went wrong. Try again")
    }
    
  }

  const editPassword = async(e) => {
    e.preventDefault()
    setLoad2(true)
    setDisableForm(true)
    toast.loading("Please wait...")
    if(oldPassword == newPassword){
      setSamePass(true);
      setNotSame(false);
      setWrongPass(false);
      setDisableForm(false)
      setDisableFormSub(false)
      toast.dismiss()
      toast.error("Something went wrong")
      setLoad2(false)
    }
    else if(newPassword != confirmPassword){
      setSamePass(false);
      setNotSame(true);
      setWrongPass(false);
      setDisableForm(false)
      setDisableFormSub(false)
      toast.dismiss()
      toast.error("Something went wrong")
      setLoad2(false)
    }else{
      try{
        const passes = {
          oldPass : oldPassword,
          newPass : newPassword
        }
        await axios.put(`${port}/editProfile?request=Password&uID=${user.uID}`, passes).then((success) => {
          if(success.status == 200){
            if(success.data.success == true){
              setWrongPass(false);
              setSamePass(false)
              setNotSame(false)
              setOldPassword("")
              setNewPassword("")
              toast.dismiss()
              toast.success('Successfully edited. logging out')
              const interval = setInterval(async() => {
                clearInterval(interval); 
                await axios.post(`${port}/logout`).then((data) => {
                  
                  const success = data.data
                  console.log(success.success);
                  if (success.success == true){
                    navigate("/pages/Login");
                  }
                })
              }, 2000);
            }else if(success.data.success == false){
              setSamePass(false);
              setNotSame(false);
              setWrongPass(true);
              setDisableForm(false)
              setDisableFormSub(false)
              toast.dismiss()
              toast.error("Something went wrong")
              setLoad2(false)
            }  
          }
        })
      }catch(e){
        console.log(e.message);
      }
    }
  }

  const editImage = async(e) =>  {
    e.preventDefault()
    setLoad2(true)
    setDisableForm(true)
    toast.loading("Please wait...")
    const formData = new FormData()
    formData.append(`files`, profilePic)
    try{
      await axios.put(`${port}/editProfilePic?request=Name&uID=${user.uID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((success) => {
        if(success.status == 200){
          setLoad2(false)
          toast.dismiss()
          toast.success('Successfully edited. refreshing page')
          setDisableForm(false)
          setInterval(() => {
            window.location.reload()
          }, 1000)
        }
      })
    }catch(e){
      console.log(e.message);
    }
  }

  //Popper
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, id, active) => {
    setAnchorEl(event.currentTarget);
    handleIDChange(id, active)
    console.log(id);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Deactivate Account
  const [userId, setUserID] = useState("")
  const [active, setActive] = useState(true)
  const [activeHolder, setActiveHolder] = useState(true)
  const [idHolder, setIdHolder] = useState("");

  const handleIDChange = (id, active) => {
    setIdHolder(id);
    setActiveHolder(active);
  }

  useEffect(() => {
    setUserID(idHolder);
    setActive(activeHolder);
    console.log(idHolder);
  }, [idHolder]);

  const handleDeactivate = async() => {
    handleClose()
    Swal.fire({
      text: "Deactivate this account?", 
      showCancelButton: true,
      confirmButtonColor: '#FF5600',
      cancelButtonColor: '#888',
      confirmButtonText: 'Confirm'
    }).then(async(result) => {
      if (result.isConfirmed) {
          if(activeHolder == 1){
            try{
              await axios.put(`${port}/handleDeactivate?action=deactivate&uID=${userId}`)
              getUserList()
              toast.success("Account Deactivated")
            }catch(e){
              console.log(e.message);
            }
            
          }else if(activeHolder == 0){
            try{
              await axios.put(`${port}/handleDeactivate?action=activate&uID=${userId}`)
              getUserList()
              toast.success("Account Deactivated")
            }catch(e){
              console.log(e.message);
            }
          }
        
      }
    })
   
  }

  //Password
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showPassword2, setShowPassword2] = useState(false);

  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };

  const [openClerk, setOpenClerk] = useState(false);
  const openClerkAdd = () => {
    setOpenClerk(true)
  }
  const closeClerkAdd = () => {
    setOpenClerk(false)
  }

  const [role, setRole] = useState("")
  const [clerkEmail, setClerkEmail] = useState("")
  const [clerkPass, setClerkPass] = useState("")
  const createClerk = async(e) => {
    e.preventDefault()
    setOpenClerk(false)
    toast.loading("Creating Account")
    const values = {
      role: role,
      email: clerkEmail,
      password: clerkPass,
      uID: uniqueID
    }
    try{
      await axios.post(`${port}/registerTemp`, values).then((data) => {
        if(data.status == 200){
          console.log(data.data.success);
          if(data.data.success == true){
            toast.dismiss()
            toast.success("Clerk Account Created")
          }else if(!data.data.success == false){
            toast.dismiss()
            toast.error(e.message)
          }
        }
      })
    }catch(e){
      console.log(e.message);
    }
  }
  const [search, setSearch] = useState("")
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return (
    <section className="monitoring">
      <div><Toaster position="bottom-center" reverseOrder={false}/></div>
      <div className="page-title">
        <p>Dean's Office Transaction</p>
        <p>Account Settings</p>
        <div className="page-desc">
          Dean's office transaction account settings.
        </div>
      </div>
      <div className="monitoring-content-holder">
        <Box className="settings-body" sx={{p: "16px", borderRadius: "10px"}}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Account Settings" value="1" />
                {user != undefined && (user.role == "Dean" || user.role == "Secretary")  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Manage Accounts" value="2" />}
              </TabList>
            </Box>
            <TabPanel value="1">
                <Grid container>
                  <Grid item xs={12} sm={6}>
                  <Typography component={"div"} sx={{mt: "40px", color: "#888"}}>
                      Change name
                    </Typography>
                    <TextField
                      disabled={disableForm}
                      className="table-search"
                      name="oldPass"
                      fullWidth
                      id="oldPass"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Typography component={"div"} sx={{color: "#888"}}>
                        Your name will appear on the logs
                    </Typography>
                    <Box sx={{width: "100%", display: "flex", justifyContent: "end", alignItems: "center", m: "5px"}}>
                      <LoadingButton disabled={name == initialname || user != undefined && user.displayName == name|| load2} onClick={editName} loading={load2}  variant="contained" sx={{ml: "20px"}} loadingPosition="end" endIcon={<SaveIcon/>}>
                        <span>Save</span>
                      </LoadingButton>
                    </Box>

                    {/* Email */}
                    <Box component={'form'} action="" onSubmit={editEmail}>
                      <Typography component={"div"} sx={{mt: "40px", color: "#888"}}>
                        Change Email
                      </Typography>
                      <FormControl sx={{width: '100%', mt: "20px" }} variant="outlined">
                          <TextField
                            error={newEmail != "" && !newEmail.endsWith("@bulsu.edu.ph") && emailPattern.test(newEmail) || wrongEmail}
                            id="outlined-adornment-password"
                            className="table-search"
                            onChange={(e) => setNewEmail(e.target.value)}
                            disabled={disableForm}
                            type={'email'}
                            label="New Email"
                            helperText={newEmail != "" && !newEmail.endsWith("@bulsu.edu.ph") && emailPattern.test(newEmail) ? "Email must be a bulsu email." : wrongEmail ? "Cannot use an existing email." : ''}
                          />
                      </FormControl>
                      <FormControl sx={{width: '100%', mt: "20px" }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                          <OutlinedInput
                            error={wrongEmailPass}
                            id="outlined-adornment-password"
                            className="table-search"
                            onChange={(e) => setEmailPass(e.target.value)}
                            disabled={disableForm}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  disabled={disableForm}
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                          {wrongEmailPass && (
                            <FormHelperText error >
                              Wrong Password.
                            </FormHelperText>
                          )}
                    </FormControl>
                      <Box sx={{width: "100%", display: "flex", justifyContent: "end", alignItems: "center", m: "10px"}}>
                        <LoadingButton disabled={!newEmail.includes("@bulsu.edu.ph")|| load2} loading={load2}  variant="contained" type="submit" sx={{ml: "20px"}} loadingPosition="end" endIcon={<SaveIcon/>}>
                          <span>Save</span>
                        </LoadingButton>
                      </Box>
                    </Box>
                    

                  {/* PassWord */}
                  <Box component={'form'} action="" onSubmit={editPassword}>
                    <Typography component={"div"} sx={{mt: "40px", color: "#888"}}>
                        Change password
                      </Typography>
                      <FormControl sx={{width: '100%', mt: "20px" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      className="table-search"
                      onChange={(e) => setOldPassword(e.target.value)}
                      required={passRequired}
                      disabled={disableForm}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            disabled={disableForm}
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Old Password"
                    />
                  </FormControl>
                  <FormControl sx={{width: '100%', mt: "20px" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      className="table-search"
                      required={passRequired}
                      disabled={disableForm}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            disabled={disableForm}
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                    />
                  </FormControl>
                  <FormControl sx={{width: '100%', mt: "20px" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      className="table-search"
                      required={passRequired}
                      disabled={disableForm}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            disabled={disableForm}
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm New Password"
                    />
                  </FormControl>
                  {samePass ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FAA0A0", border: '2px solid red', padding: '10px', color: "white", fontWeight: "bold"}}>
                      Old Password and New password cannot be the same
                  </Typography>: ''}
                  {wrongPass ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FAA0A0", border: '2px solid red', padding: '10px', color: "white", fontWeight: "bold"}}>
                      Old Password is not correct.
                  </Typography>: ''}
                  {notSame ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FAA0A0", border: '2px solid red', padding: '10px', color: "white", fontWeight: "bold"}}>
                      New password and Corfirm Password are not the same
                  </Typography>: ''}
                  <Box sx={{width: "100%", display: "flex", justifyContent: "end", alignItems: "center", m: "10px"}}>
                    <LoadingButton disabled={!oldPassword || !newPassword || !confirmPassword || load2} loading={load2}  variant="contained" type="submit" sx={{ml: "20px"}} loadingPosition="end" endIcon={<SaveIcon/>}>
                      <span>Save</span>
                    </LoadingButton>
                  </Box>
                  </Box>
                    
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box component={'form'} action="" onSubmit={editImage}>
                      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", alignItems: "center", mt: "20px"}}>
                        <Typography component={"div"} sx={{mt: "20px"}}>
                          Profile Picture
                        </Typography>
                        <Avatar src={imageDis} sx={{width: 150, height: 150, m: "20px"}}/>
                        <Button component="label" disabled={disableForm} variant="contained" startIcon={<CloudUploadIcon />} sx={{m: "1vh", mb: "20px", backgroundColor: "#FF6347", '&:hover': {backgroundColor: "#212121"}}}>
                            Upload file
                          <VisuallyHiddenInput disabled={disableForm} type="file" accept='.png, .jpg, .jpeg' onChange={onImageChange} id="profile-img"/>
                        </Button>
                      </Box>
                      <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", m: "5px"}}>
                        <LoadingButton disabled={!profilePic|| load2} loading={load2}  variant="contained" type="submit" sx={{ml: "20px"}} loadingPosition="end" endIcon={<SaveIcon/>}>
                          <span>Save</span>
                        </LoadingButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
            </TabPanel>

            { user != undefined && (user.role === "Dean" || user.role === "Secretary") ? (
            <>
                <TabPanel value="2" sx={{p: 0}}>
                  <Stack
                    className="table-main"
                    direction={windowWidth <= 576 ? "column" : "row"}
                    spacing={2}
                    style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px" }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      style={{ fontWeight: "bold" }}
                      onClick={openClerkAdd}
                    >
                      Add Staff
                    </Button>
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
                          placeholder: "Account Name, Email",
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Stack>
                  <Box sx={{maxHeight: "550px", overflowY: "auto", width: "100%",display: "flex", justifyContent: "center", alignContent: "center"}}>
                    <Grid container xs={12}>
                      {userList.filter(item => item.role !== "Dean" && item.temporary != 1).sort((a, b) => {
                        const roleA = a.role.toLowerCase();
                        const roleB = b.role.toLowerCase();
                    
                        if (roleA.includes("clerk") && !roleB.includes("clerk")) return -1;
                        if (!roleA.includes("clerk") && roleB.includes("clerk")) return 1;
                        return 0;
                      }).filter((item) => 
                        item.full_Name.toLowerCase().includes(search.toLowerCase()) ||
                        item.email.toLowerCase().includes(search.toLowerCase())
                        ).map((userList) => {
                        return(
                        <Grid item xs={12} sm={6} m={6} lg={4} justifyContent={'center'} sx={{m: "20px 0 0 0", maxWidth: "100%"}}>
                          <Card sx={{ display: 'flex', maxWidth: "350px", alignItems: "center", mb: "1vh", height: "100px", maxHeight: "100px", width: '350px'}}>
                            <CardMedia
                                component="img"
                                sx={{width: "100px", maxWidth: "100px", maxHeight: "100px", borderRadius: "50%", p: "5px" }}
                                image={`${port}/profile_Pictures/${userList.profilePic}`}
                                alt="Profile Picture"
                              />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <CardContent sx={{width: "100%", maxWidth: "230px", width: "230px" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                                  <Typography component="div" sx={{fontSize: "0.9rem", maxWidth: "230px", width: "230px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                    {userList.full_Name}
                                  </Typography>
                                </Box>
                                <Typography variant="subtitle1" component="div" sx={{fontSize: "0.75rem", color: "#999999", maxWidth: "230px", width: "230px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}> 
                                  {userList.email}
                                </Typography>
                                <Typography variant="subtitle1" component="div" sx={{fontSize: "0.85rem", color: "#999999"}}> 
                                  {userList.role}
                                </Typography>
                                <Typography variant="subtitle1" component="div" sx={{userSelect: "none",fontSize: "0.85rem", color: userList.Active == 1 ? "limeGreen" :  "red"}}> 
                                  {userList.Active == 1 ? "Active" : "Deactivated"}
                                </Typography>
                              </CardContent>
                            </Box>
                            <Box sx={{width: "20px", display: "flex", justifyContent: "end"}}>
                              <MoreVertIcon sx={{color: "#999999", display: "flex", justifyContent: "end", cursor: "pointer"}}  id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={(e) => handleClick(e, userList.uID, userList.Active)}/>
                            </Box>
                          </Card>
                        </Grid>
                      )})}
                    </Grid>
                  </Box>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={(e) => handleDeactivate()}><Typography sx={{color: activeHolder == 1 ? "#C41E3A" : "limeGreen"}}>{activeHolder == 1 ? "Deactivate Account" : "Activate Account"}</Typography></MenuItem>
                  </Menu>
                  
                  {/* {loading ? (
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
                        Add incoming or outgoing documents.
                      </div>
                    </div>
                  ) : (
                    ""
                  )} */}
              </TabPanel>
              </>

            ): ''}
           
          </TabContext>
          </Box>
      </Box>
      </div>

      <Dialog open={openClerk} fullWidth maxWidth="xs" className="Dialog" >
        <DialogContent className="form-body">
          <Box component={"form"} onSubmit={createClerk} action=""> 
              <Typography sx={{fontWeight: "700", fontSize: "0.9rem", m: "1vh"}}>Add staff using email and password</Typography>
              <Box sx={{display: "flex", justifyContent: 'center', flexDirection:"column"}}>
              <FormControl sx={{width: "100%", justifyContent: "center", alignItems: "start", margin: "1vh"}}>
                <FormLabel id="demo-row-radio-buttons-group-label">Role</FormLabel>
                <RadioGroup
                  row
                  sx={{display: 'flex', flexDirection:'row', padding: "0px 20px", width: "100%", justifyContent: "space-around"}}
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}>
                  <FormControlLabel sx={{margin: "0px 10px"}} value="Secretary" control={<Radio />} label="Secretary" />
                  <FormControlLabel sx={{margin: "0px 10px"}} value="Clerk" control={<Radio />} label="Clerk" />
                  <FormControlLabel sx={{margin: "0px 10px"}} value="Student Assistant" control={<Radio />} label="SA" />
                </RadioGroup>
              </FormControl>
              <TextField
                error={!clerkEmail.endsWith("@bulsu.edu.ph") && clerkEmail != ""}
                type="email"
                disabled={disableForm}
                className="table-search"
                name="oldPass"
                fullWidth
                sx={{m: "1vh", backgroundColor: "#FFF"}}
                id="oldPass"
                value={clerkEmail}
                onChange={(e) => setClerkEmail(e.target.value)}
                label="Email"
                helperText={!clerkEmail.endsWith("@bulsu.edu.ph") && clerkEmail != "" &&  "Email must be a bulsu email."}
              />
              <FormControl sx={{width: '100%', m: '1vh'}} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Temporary Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    required
                    sx={{backgroundColor: "#FFF"}}
                    onChange={(e) => setClerkPass(e.target.value)}
                    type={showPassword2 ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword2}
                          edge="end"
                        >
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Temporary Password"
                  />
                  </FormControl>
              </Box>
              <Box sx={{width: "100%"}}>
              <div className="form-bottom">
                  <div className="form-submit-cancel">
                    <div className="submit-cancel">
                      <button
                        type="button"
                        className="form-cancel"
                        onClick={closeClerkAdd}
                      >
                        Cancel
                      </button>
                        <button type="submit" className="form-submit">
                          Submit
                        </button>
                    </div>
                  </div>
                </div>
              </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Settings;
