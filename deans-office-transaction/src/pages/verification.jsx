import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import cictLogo from '../Images/cict-logo.png'
import verifyIMG from '../Images/verified.png'
import noToken from '../Images/noToken.png'

function Verification() {
    const port = "http://localhost:3001"
    const { token } = useParams()
    const [exist, setExist] = useState(false)
    useEffect(() => {
        const verifyEmail = async() => {
            try{
                await axios.get(`${port}/verify?token=${token}`).then((response) => {
                    if(response.data.success == true){
                        setExist(true)
                    }
                    else{
                        setExist(false)
                    }
                })
            }catch(e){
                console.log(e.message);
            }
        }
        verifyEmail()
    }, [])

    return (
        <div style={{width: "100%", display:'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: "2rem"}}>
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'}}>
                <img src={cictLogo} alt="logo" width={"100px"} style={{marginBottom: "1rem"}}/>
                <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <p style={{fontWeight: 'bold', marginBottom: '5px'}}>College of Information and Communications Technology</p>
                    <p style={{color: "#999999"}}>Dean's Office Transaction System</p>
                </div>
            </div>
            <img src={exist ? verifyIMG : noToken} alt="" height={"500px"}/>
            <p style={{fontWeight: 'bold', marginBottom: '10px', fontSize: "2rem", color: '#FF9944'}}>{exist ? "Email Verified" : "Token does not exist"}</p>
            <Link to="/pages/Login" style={{color: "#888888"}}>Go to Login Page</Link>
        </div>
    )
}

export default Verification