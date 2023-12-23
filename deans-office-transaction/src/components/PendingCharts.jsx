import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Autocomplete, Box, Button, Checkbox, Fade, FormControlLabel, FormGroup, Grid, Menu, Paper, Popper, TextField, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { CheckBox } from '@mui/icons-material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PendingCharts() {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const documentsRef = collection(db, "documents")
  const [statusDone, setStatusDone] = useState(0)
  const [statusPending, setStatusPending] = useState(0)
  const [statusNotDone, setStatusNotDone] = useState(0)
  const [docType, setDocType] = useState([])
  const [buttonData, setButtonData] = useState([])
  const [isChecked, setIsChecked] = useState(true);
  const [statuses, setStatuses] = useState([])

  const getStatus = async() => {
    const data = await getDocs(documentsRef)
    const buttonSet = new Set()
    const statusSet = new Set()
    data.forEach((doc) => {
      if(doc.data().forward_To === auth.currentUser.uid || doc.data().forwarded_By === auth.currentUser.uid || doc.data().accepted_Rejected_By === auth.currentUser.uid){
        const status = doc.data().Status
        const whatDoc = doc.data().document_Type
        statusSet.add(status)
        if(whatDoc){
          buttonSet.add(whatDoc)
        }
        if(docType.length === 0){
          if(status === "Completed"){
            setStatusDone(prev => prev + 1)
          }
          else if(status === "Pending"){
            setStatusPending(prev => prev + 1)
          }
          else if(status === "Rejected"){
            setStatusNotDone(prev => prev + 1)
          }
        }else{
          if(status === "Completed" && docType.includes(whatDoc)){
            setStatusDone(prev => prev + 1)
          }
          else if(status === "Pending" && docType.includes(whatDoc)){
            setStatusPending(prev => prev + 1)
          }
          else if(status === "Rejected" && docType.includes(whatDoc)){
            setStatusNotDone(prev => prev + 1)
          }
        }
      }
      
    })
    const buttonArray = Array.from(buttonSet)

    setStatuses(Array.from(statusSet))
    setButtonData(buttonArray)
  }

  useEffect(() => {
    setStatusDone(0)
    setStatusPending(0)
    setStatusNotDone(0)
    getStatus()
    if(docType.length == 0){
      setIsChecked(true)
    }else{
      setIsChecked(false)
    }
  }, [docType])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: docType === "StudentDoc" ? "Student" + ' Documents Status' : docType === "FacultyDoc" ? "Faculty" + ' Documents Status' : docType === "NewHireDoc" ? "New Hire"+ ' Documents Status'  : docType === "IPCROPCRDoc" ? "IPCR/OPCR"+ ' Documents Status'  : docType + ' Documents Status',
      },
    },
    scales:{
      // x:{
      //   grid:{
      //     color: "white"
      //   }
      // },
      // y:{
      //   grid:{
      //     color: "white"
      //   }
      // }
    }
  };
  
  const labels = ['Status'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Completed',
        data: [statusDone],
        backgroundColor: 'rgba(81, 206, 81, 0.7)',
      },
      {
        label: 'Pending',
        data: [statusPending],
        backgroundColor: 'rgba(255, 187, 62, 0.7)',
      },
      {
          label: 'Rejected',
          data: [statusNotDone],
          backgroundColor: 'rgba(250, 98, 98, 0.7)',
      },
    ],
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const filterChart = (e, data) => {
  if (data.length >= 0){
      setDocType(data)
  }
  }
  return(
    <div className="pending-holder">
        
        <div className="pending-button">
          <Button variant="contained" className='type-title-button' aria-controls={open ? 'basic-menu' : undefined}aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>Filter</Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            
          >
            <Box sx={{p: "20px", display: "flex", flexDirection: "column", maxHeight: "250px",minWidth: '250px', width: "100%"}}>
                {/* <FormControlLabel control={<Checkbox checked={docType.length === 0}  onChange={(e) => docType.length !== 0 ? setDocType([]): ''}/>} label={"All Documents"} />
                {buttonData.map((buttonData, index) => {
                  return <FormControlLabel control={<Checkbox checked={docType.includes(buttonData)}  onChange={(e) => filterChart(buttonData)}/>} label={buttonData}/>
                })} */}
                 <Autocomplete
                    sx={{width: "100%"}}
                    multiple
                    size='small'
                    value={docType}
                    onChange={filterChart}
                    getOptionLabel={(option) => option}
                    disableCloseOnSelect
                    id="tags-standard"
                    options={buttonData}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Document Types"
                        placeholder="Document Types..."
                      />
                    )}
                  />
            </Box>  
          </Menu>
      
        </div>
        <div className="pending-chart">
            <Bar options={options} data={data} />
        </div>
        
    </div>
  ) 
}
