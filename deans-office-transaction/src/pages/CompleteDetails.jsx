import { React, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import cictlogo from '../Images/cict-logo.png'
import { UserAuth } from '../components/AuthContext';
import { Avatar, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper } from '@mui/material';
import userPic from '../Images/user.png'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import bild from '../Images/BiLD.png'
import bgImage from '../Images/Subtract.png'
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { useNavigate } from 'react-router';
const defaultTheme = createTheme();

export default function CompleteDetails() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPass, setRegisterPass] = useState("");
    const [registerCPass, setRegisterCPass] = useState("");
    const [registerFname, setRegisterFname] = useState("");
    const [registerLname, setRegisterLname] = useState("");
    const [profilePic, setProfilePic] = useState(userPic)
    const [imageDis, setImageDis] = useState(userPic)
    const {createUser} = UserAuth()

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
    const port = "http://localhost:3001"
    const [user, setUser] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
      const getToken = async() =>{
          await axios.get(`${port}/getUser`).then((data) => {
              setUser(data.data[0])
          })
      }
      getToken()
    }, []);
    const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append(`files`, profilePic)
        formData.append(`password`, registerPass)
        formData.append(`full_Name`, registerFname + " " + registerLname)
        formData.append(`file_Name`, profilePic.name)
        formData.append(`email`, user.email)
        try{
          await axios.post(`${port}/completeRegister?uID=${user.uID}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
          }).then(async() => {
            Swal.close()
            await Swal.fire({title: "Successfully Completed. ", text: "Verification Link is sent to the email.", icon: "success", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
            await axios.post(`${port}/logout`).then((data) => {
              const success = data.data
              if (success.success == true){
                  navigate("/pages/Login");
              }
            })
          })   
        }catch(e){

        }
                      
    };
    useEffect(() => {
    }, [handleSubmit])

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
    };

    //Password
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  return (
    <section className='sign-up-body temp'>
      <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm" sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}>
              <CssBaseline />
              <Box
                sx={{
                  padding: '2rem',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: "2",
                  position: "relative",
                  backgroundColor: "white",
                }}
              >
                <Typography component="h1" variant="h5" sx={{fontWeight: "bold", width: "100%", display: "flex", justifyContent: "start"}}>
                  Details
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ paddingTop: 3, zIndex: 100 }}>
                      <Box sx={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        <Avatar src={imageDis} alt='Profile Picture' sx={{height: 96, width: 96, m: "1vh"}}/>
                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{m: "1vh", mb: "2vh", backgroundColor: "#FF9944", '&:hover': {backgroundColor: "#212121"}}}>
                          Upload file
                          <VisuallyHiddenInput type="file" accept='.png, .jpg, .jpeg' onChange={onImageChange} required={profilePic == userPic}/>
                        </Button>
                      </Box>
                      <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                              <TextField
                              autoComplete="given-name"
                              name="firstName"
                              required
                              fullWidth
                              id="firstName"
                              label="First Name"
                              autoFocus
                              onChange={(event) => {setRegisterFname(event.target.value)}}
                              inputProps={{ maxLength: 30 }}
                              />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <TextField
                              required
                              fullWidth
                              id="lastName"
                              label="Last Name"
                              name="lastName"
                              autoComplete="family-name"
                              inputProps={{ maxLength: 30 }}
                              onChange={(event) => {setRegisterLname(event.target.value)}}
                              />
                          </Grid>
                          <Grid item xs={12}>
                          <FormControl sx={{width: '100%', mb: "1vh" }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                            <OutlinedInput

                              error={(registerPass != "" && registerPass.length < 6 )|| (registerPass != "" && registerCPass != "" && registerPass != registerCPass)}
                              id="outlined-adornment-password"
                              required
                              onChange={(event) => {setRegisterPass(event.target.value)}}
                              type={showPassword ? 'text' : 'password'}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
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
                            {(registerPass != "" && registerCPass != "" && registerPass != registerCPass)? (
                              <FormHelperText error >
                              Passwords does not match
                              </FormHelperText>
                            ) : (registerPass != "" && registerPass.length < 6 ) && (
                              <FormHelperText error >
                              Password is too short.
                              </FormHelperText>
                            )}
                            
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl sx={{width: '100%', mb: "1vh" }} variant="outlined">
                              <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                              <OutlinedInput
                                error={registerPass != "" && registerCPass != "" && registerPass != registerCPass}
                                id="outlined-adornment-password"
                                required
                                onChange={(event) => {setRegisterCPass(event.target.value)}}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label="Confirm Password"
                              />
                              {(registerPass != "" && registerCPass != "" && registerPass != registerCPass) && (
                              <FormHelperText error >
                              Passwords does not match
                              </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          </Grid>
                          <Button
                          disabled={profilePic == userPic || !registerCPass || !registerFname || !registerLname || !registerPass || (registerPass != "" && registerCPass != "" && registerCPass != registerPass)}
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2, bgcolor:"#FF9944" }}
                          className='login-button'
                          >
                          Submit
                          </Button>
                          <Grid container justifyContent="center">
                          
                      </Grid>
                </Box>
              </Box>
            </Container>
    </ThemeProvider>
    </section>
  );
}