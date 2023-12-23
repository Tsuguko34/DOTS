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
import user from '../Images/user.png'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import bild from '../Images/BiLD.png'
import bgImage from '../Images/Subtract.png'
import { Typewriter } from 'react-simple-typewriter';
const defaultTheme = createTheme();

export default function SignUp() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPass, setRegisterPass] = useState("");
    const [registerCPass, setRegisterCPass] = useState("");
    const [registerFname, setRegisterFname] = useState("");
    const [registerLname, setRegisterLname] = useState("");
    const [profilePic, setProfilePic] = useState(user)
    const [imageDis, setImageDis] = useState(user)
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

    const handleSubmit = async(event) => {
        event.preventDefault();
        await createUser(registerEmail, registerPass, registerFname, registerLname, registerCPass, profilePic)
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
        console.log(profilePic);
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
    <section className='sign-up-body'>
      <ThemeProvider theme={defaultTheme}>
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
                        paddingTop: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography component="h1" variant="h5" sx={{fontWeight: "bold", width: "100%", display: "flex", justifyContent: "start"}}>
                        Sign up
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} sx={{ paddingTop: 3, zIndex: 100 }}>
                            <Box sx={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                              <Avatar src={imageDis} alt='Profile Picture' sx={{height: 96, width: 96, m: "1vh"}}/>
                              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{m: "1vh", mb: "2vh", backgroundColor: "#FF9944", '&:hover': {backgroundColor: "#212121"}}}>
                                Upload file
                                <VisuallyHiddenInput type="file" accept='.png, .jpg, .jpeg' onChange={onImageChange} required={profilePic == user}/>
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
                                    <TextField
                                    error={!registerEmail.endsWith("@bulsu.edu.ph") && registerEmail != ""}
                                    type='email'
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    inputProps={{ maxLength: 50 }}
                                    onChange={(event) => {setRegisterEmail(event.target.value)}}
                                    helperText={!registerEmail.endsWith("@bulsu.edu.ph")&& registerEmail != "" ? "Bulsu email is required to be registered." : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                <FormControl sx={{width: '100%', mb: "1vh" }} variant="outlined">
                                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
                                    label="Password"
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
                                disabled={profilePic == user || !registerCPass || !registerEmail || !registerFname || !registerLname || !registerPass}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, bgcolor:"#FF9944" }}
                                className='login-button'
                                >
                                Sign Up
                                </Button>
                                <Grid container justifyContent="center">
                                <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography sx={{color:  "#212121"}}>
                                Already have an account?
                                </Typography>
                                    <Link href="/pages/Login" variant="body2" sx={{cursor: "pointer", "&:hover" : {color: "#FF647F"}, transition: "150ms"}}>
                                       &nbsp;Sign in 
                                    </Link>
                                </Grid>
                            </Grid>
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </Grid>
            </Grid>
    </ThemeProvider>
    </section>
  );
}