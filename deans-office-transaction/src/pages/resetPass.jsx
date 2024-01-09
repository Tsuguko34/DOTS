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
import { useNavigate, useParams } from 'react-router';
const defaultTheme = createTheme();

export default function ResetPass() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPass, setRegisterPass] = useState("");
    const [registerCPass, setRegisterCPass] = useState("");
    const [registerFname, setRegisterFname] = useState("");
    const [registerLname, setRegisterLname] = useState("");
    const [profilePic, setProfilePic] = useState(userPic)
    const [imageDis, setImageDis] = useState(userPic)
    const {createUser} = UserAuth()
    const port = "http://localhost:3001"
    const [user, setUser] = useState("")
    const navigate = useNavigate()
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
    const { email, token } = useParams()
    useEffect(() => {
      checkTokens()
    }, [])
    const checkTokens = async() => {
      try{
        await axios.get(`${port}/checkResetToken?email=${email}&token=${token}`).then((data) => {
          if(data.data.exist == false){
            navigate('/pages/Login')
          }
          else if(data.data.success == false){
            navigate('/pages/Login')
          }
        })
      }catch(e){
        console.log(e.message);
      }
    }
    const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append(`password`, registerPass)
        try{
          await axios.put(`${port}/completeResetPass?email=${email}&token=${token}&password=${registerPass}`, formData).then(async(data) => {
            if (data.data.success == true){
              Swal.close()
              await Swal.fire({title: "Password Reset. ", text: "password has been reset successfully.", icon: "success", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
              navigate("/pages/Login");
            }
            else if(data.data.success == false){
              await Swal.fire({text: "An error has occured while reseting the password.", showConfirmButton: true, allowEscapeKey: false, allowOutsideClick: false})
            }
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
                  Reset Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ paddingTop: 3, zIndex: 100 }}>
                      <Grid container spacing={2}>
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
                          disabled={!registerCPass || !registerPass || (registerPass != "" && registerCPass != "" && registerCPass != registerPass)}
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