import { useEffect, useState } from "react";
import "./App.css";
import Navpages from "./components/Navpages";
import { Box, Typography } from "@mui/material";
import noInternet from './Images/noInternet.png'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3001')


function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Add event listeners to detect changes in online/offline status
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  useEffect(()=> {
    document.querySelector("body").setAttribute('data-theme', localStorage.getItem('theme'))
  },[])
  return (
    <div className="body">
      <div className="content2">
        {isOnline ? <Navpages /> : (
          <Box sx={{width: "100%", height: "100%",display: "flex",flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: "#FFF"}}>
            <img src={noInternet} alt="" style={{width: "400px", height: "400px"}}/>
            <Typography sx={{color: "#FF5600", fontSize: "1.5rem", fontWeight: 'bold'}}>No Internet Connection</Typography>
          </Box>
        )}
      </div>
    </div>
  );
}

export default App;
