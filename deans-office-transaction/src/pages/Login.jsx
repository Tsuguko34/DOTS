import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GoogleIcon from '@mui/icons-material/Google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import cictlogo from '../Images/cict-logo.png'
import './Pages.css'
import Swal from "sweetalert2";
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router';
import { UserAuth } from '../components/AuthContext';
import { Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Step, StepContent, Stepper } from '@mui/material';
import { confirmPasswordReset, fetchSignInMethodsForEmail, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithEmailLink, signOut, updatePassword } from 'firebase/auth';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockResetIcon from '@mui/icons-material/LockReset';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CircularProgress from '@mui/material/CircularProgress';
import { Toaster } from 'react-hot-toast';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import bild from '../Images/BiLD.png'
import bgImage from '../Images/Subtract.png'
import { Typewriter } from 'react-simple-typewriter';
import axios from "axios";
  const defaultTheme = createTheme();
  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }));
  
  function QontoStepIcon(props) {
    const { active, completed, className } = props;
  
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }
  
  QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
  };
  
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
  }));
  
  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
    }),
  }));
  
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <AlternateEmailIcon />,
      2: <LockResetIcon />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
  };
  
  
  export default function Login() {
    const navigate = useNavigate();
    const port = "http://localhost:3001"
    axios.defaults.withCredentials = true
    useEffect(() => {
        Swal.fire({
            title: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen:async() => {
              Swal.showLoading()
              try{
                  await axios.get(`${port}/getUser`).then((data) => {
                    console.log(data);
                      if(data.status == 401){
                        Swal.close()
                      }else{
                        Swal.fire({title: "Logged in", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
                        navigate('/pages/Dashboard')
                      }
                  }).catch(()=> {
                      Swal.close()
                  })
              }
              catch(e){
                
              }
            }})  
    },[])

    const {googleSignIn} = UserAuth()
    const signInWithGoogle = () => {
        googleSignIn()
    }
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPass, setLoginPass] = useState("");
    const {signin} = UserAuth()
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [error, setError] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async(event) => {
      event.preventDefault();
        await signin(loginEmail, loginPass)
        setError(null);
        setLoginAttempts(loginAttempts + 1);
        if (loginAttempts === 2) {
            setIsDisabled(true);
            setRemainingTime(30)
            setTimeout(() => {
                setIsDisabled(false);
            }, 30000); // 30 seconds in milliseconds
        }
        else if(loginAttempts === 5){
            setIsDisabled(true);
            setRemainingTime(60)
            setTimeout(() => {
                setIsDisabled(false);
                setLoginAttempts(0);
            }, 60000); // 30 seconds in milliseconds
        }
    };

    useEffect(() => {
        let timerInterval;
    
        if (remainingTime > 0) {
          timerInterval = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000); // Update every second
        } else {
          clearInterval(timerInterval);
        }
        return () => {
          clearInterval(timerInterval);
        };
      }, [remainingTime, loginAttempts]);

    const [openResetPass, setOpenResetPass] = useState(false)
    const [resetEmail, setResetEmail] = useState("")
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [exist, setExist] = useState(false)
    const [notexist, setNotExist] = useState(false)
    const [samePass, setSamePass] = useState(false)
    const [wrongPass, setWrongPass] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
    const [changingPass, setChangingPass] = useState(false)
    const [notSame, setNotSame] = useState(false)
    const steps = ['Enter email', 'Reset Password'];
    const handleResetPassOpen = () => {
        setOpenResetPass(true);
    };

    const handleResetPassClose = () => {
        setOldPassword("")
        setResetEmail("")
        setChangingPass(false)
        setResetSuccess(false)
        setSamePass(false)
        setWrongPass(false)
        setNewPassword("")
        setNotSame(false)
        setOpenResetPass(false);
        setExist(false)
        setNotExist(false)
        setActiveStep(0);
        signOut(auth)
        setOpenResetPass(false);
    };

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
    
    const resetPass = async(e) => {
        e.preventDefault()
        await fetchSignInMethodsForEmail(auth, resetEmail).then(async(signInMethods) => {
            if(signInMethods.length){
                handleNext()
            }else{
                setExist(false)
                setNotExist(true)
            }
        })
        
    }

    const resetPassNew = async(e) => {
        e.preventDefault()
        await fetchSignInMethodsForEmail(auth, resetEmail).then(async(signInMethods) => {
            setWrongPass(false)
            setResetSuccess(false)
            setSamePass(false)
            setChangingPass(true)
            if(signInMethods.length){
                if(oldPassword != newPassword){
                  if(newPassword == confirmPassword){
                    await signInWithEmailAndPassword(auth, resetEmail, oldPassword).then(async(data) => {
                        try{
                            const user = auth.currentUser;
                            await updatePassword(user, newPassword).then(data => {
                                setChangingPass(false)
                                setResetSuccess(true)
                                setSamePass(false)
                                setNotSame(false)
                                setOldPassword("")
                                setNewPassword("")
                            })
                            setTimeout(() => {
                                handleResetPassClose()
                            }, 2000)
                        }catch(e){

                        }
                    }).catch(error => {
                        setChangingPass(false)
                        setWrongPass(true)
                        setNotSame(false)
                    })
                  }else{
                    setChangingPass(false)
                    setSamePass(false)
                    setResetSuccess(false)
                    setNotSame(true)
                  }
                    
                }else{
                    setChangingPass(false)
                    setSamePass(true)
                    setResetSuccess(false)
                    setNotSame(false)
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
    return (
    <section className='login-screen'>
        <ThemeProvider theme={defaultTheme}>
            <Toaster position="bottom-center"/>

            <Grid container component="main" sx={{ height: '100vh', }}>
              <CssBaseline />
              <Grid
                className='login-bg'
                item
                xs={false}
                sm={4}
                md={7}
                lg={8}
                sx={{
                  borderTopRightRadius: '20px', 
                  borderBottomRightRadius: '20px',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: 'inset -10px 0 20px -10px rgba(0, 0, 0, 0.5)', // Add this line for the inner shadow
                }}
              />
              <Grid item className='login-bgright' xs={12} sm={8} md={5} lg={4} component={Paper} 
                sx={{
                  boxShadow: 'none',
                }}>
                <Box 
                  sx={{
                    my: 2,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  
                  <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                      sx={{
                      marginTop: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      }}
                  >
                    <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: "50px"}}>
                      <Box>
                        <img src={cictlogo} alt="" style={{objectFit: 'cover', width: '100px'}}/>
                      </Box>
                    </Box>
                    <Typography sx={{fontWeight: 'bold', fontSize: "1.4rem", display: 'flex', width: "100%", justifyContent: 'start', color: "#555"}}>
                      Dean's Office Transaction
                    </Typography>
                    <Typography sx={{fontWeight: 'bold', fontSize: "1.4rem",mb: "20px", display: 'flex', width: "100%", justifyContent: 'start', color: "#555", height: "2rem", alignItems: "center" }}>
                      Welcome,&nbsp; <Typography sx={{fontWeight: 'bold', fontSize: "1.5rem", color: "#FF9944"}}><Typewriter words={['Dean', 'Clerk', 'Faculty']} loop typeSpeed={40}/></Typography> 
                    </Typography>
                      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                      <Typography sx={{fontWeight: '300', color: "#888", display: 'flex', width: "100%", justifyContent: 'start', fontSize: "0.8rem"}}>
                      Email
                      </Typography>
                      <TextField
                          type='email'
                          disabled={isDisabled}
                          required
                          sx={{mb: "10px"}}
                          fullWidth
                          id="email"
                          placeholder="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          onChange={(event) => setLoginEmail(event.target.value)}
                      />
                      <FormControl sx={{width: '100%' }} variant="outlined">
                        <Typography sx={{fontWeight: '300', color: "#888", display: 'flex', width: "100%", justifyContent: 'start', fontSize: "0.8rem"}}>
                        Password
                        </Typography>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          required
                          placeholder='Password'
                          onChange={(event) => setLoginPass(event.target.value)}
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
                        />
                      </FormControl>
                      {isDisabled ? <Typography component="div" sx={{display: "flex", justifyContent: "center", alignItems: "center", color: "red"}}>
                          {loginAttempts} Attempts failed. Please wait for {remainingTime}
                      </Typography>: ""}
                      <Box sx={{width: "100%", display: 'flex', justifyContent: 'right', mt: '10px'}}>
                        <Link variant="body2" onClick={handleResetPassOpen} sx={{cursor: "pointer", "&:hover" : {color: "#FF647F"}, transition: "150ms"}}>
                              Forgot password?
                        </Link>
                      </Box>
                      
                      <Button
                          disabled={isDisabled}
                          type="submit"
                          fullWidth
                          variant="contained"
                          className='login-button'
                          sx={{ mt: "50px", mb: 2, bgcolor: "#FF9944"}}
                      >
                          Login
                      </Button>
                      <Box sx={{width: '100%', display: 'flex', justifyContent: "center", alignItems: "center"}}>
                        <Typography sx={{color:  "#212121"}}>
                          Don't have an account? 
                        </Typography>
                        <Link href="/pages/SignUp" variant="body2" sx={{cursor: "pointer", "&:hover" : {color: "#FF647F"}, transition: "150ms"}}>
                            Sign Up
                        </Link>
                      </Box>
                      </Box>
                      
                  </Box>
                  
                  </Container>
                </Box>
              </Grid>
            </Grid>
        </ThemeProvider>

        <Dialog open={openResetPass} fullWidth maxWidth="sm">
            <DialogTitle>
                <div className="display-title-holder2">
                Reset Password
                <div className="dialog-title-close">
                <button onClick={handleResetPassClose}>Close</button>
                </div>
                </div>
            </DialogTitle>
            <DialogContent>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
                ))}
            </Stepper>
            {activeStep == 0 ? 
                <Box component="form" onSubmit={resetPass} sx={{width: "100%"}}>
                    <TextField
                        type='email'
                        margin="normal"
                        required
                        value={resetEmail}
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(event) => setResetEmail(event.target.value)}
                    />
                    {notexist ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FAA0A0", border: '2px solid red', padding: '10px', color: "white", fontWeight: "bold"}}>
                        Email does not exist.
                    </Typography>: ''}
                    <Box sx={{display: "flex", justifyContent: "end"}}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className='login-button'
                            sx={{ mt: 3, mb: 2, bgcolor: "#FF9944", width: "20%"}}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
                    : 
                <Box component="form" onSubmit={resetPassNew} sx={{width: "100%"}}>
                  <FormControl sx={{width: '100%', mb: "1vh" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
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
                    label="Old Password"
                  />
                </FormControl>
                <FormControl sx={{width: '100%', mb: "1vh" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
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
                </FormControl>
                <FormControl sx={{width: '100%', mb: "1vh" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {resetSuccess ? <Typography component='div' sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#C1E1C1", border: '2px solid green', padding: '10px', color: "white", fontWeight: "bold"}}>
                        Password has been reset.
                    </Typography>: ''}
                    {changingPass ? <Box sx={{display: 'flex', width: "100%" , justifyContent: "center", alignItems: "center"}}><CircularProgress /></Box> : ''}
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button
                            fullWidth
                            variant="contained"
                            className='login-button'
                            sx={{ mt: 3, mb: 2, bgcolor: "grey", width: "20%"}}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className='login-button'
                            sx={{ mt: 3, mb: 2, bgcolor: "#FF9944", width: "20%"}}
                        >
                            Submit
                        </Button>
                    </Box>
                    
                </Box>}
            </DialogContent>
        </Dialog>
    </section>
      
      
    );
  }
