import React, { useEffect, useReducer, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { db} from '../firebase';
import {addDoc, collection, deleteDoc, doc, endBefore, getDoc, getDocs, limit, limitToLast, orderBy, query, startAfter, where} from 'firebase/firestore'


const Calendar = () => {
  var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
  dayjs.extend(isSameOrAfter)


    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(new Date());
    const finalValue = dayjs(value).format('dddd, MMMM D, YYYY');
    let [schedule, setSchedule] = useState("");
    const [highlighteddays, setHighlighteddays] = useState([]);
    const [schedHolder, setSchedHolder] = useState([])
    const outgoingCollectionRef = collection(db, "documents");

    useEffect(() => {
      const getSchedule = async () =>{
        const data = await getDocs(outgoingCollectionRef)
        data.forEach((doc) => {
          setHighlighteddays(highlighteddays => [...highlighteddays, doc.data().Sched_Date])
        })
      }
      getSchedule();
    }, [])


    const showSched = async (newValue) =>{
      setLoading(true)
      setValue(newValue)
        if(highlighteddays.includes(dayjs(newValue).format('MM/DD/YYYY').toString())){
          const q = query(outgoingCollectionRef, where("Sched_Date", "==", dayjs(newValue).format('MM/DD/YYYY').toString()))
          const data = await getDocs(q)
          setSchedHolder(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
          console.log("loop");
        }else{
          setLoading(false)
          setSchedule("No meetings for today")
        }
        setLoading(false)    
    }

      useEffect(() =>{
        schedHolder.map((schedHolder) => {
          setSchedule(schedHolder.Sched)
        })   
      }, [schedHolder])
  
      useEffect(() => {
        showSched(dayjs())
        console.log("looping");
      }, [highlighteddays])
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        
        <div className="whole-holder">
          <StaticDatePicker
            className='static-date-picker'
            // mask='____/__/__'
            sx={{
              '& .MuiDatePickerToolbar-title': {display: 'none'},
              '& .MuiDatePickerToolbar': {display: 'none'},
              '& .MuiPickersToolbar-root': {display: 'none'},
              '& .MuiPickersToolbar-content': {display: 'none'},
              '& .MuiTypography-root': {display: 'none'},
              '& .MuiPickersLayout-actionBar': {display: 'none'},
              '& .MuiDayCalendar-weekContainer': {marginBottom: '1vh'},
              '& .MuiPickersDay-root:hover': {backgroundColor: '#fcddcd'},
              '& .MuiPickersDay-root.Mui-selected': {color: '#FFFFFF',backgroundColor: '#212121'},
              '& .MuiPickersDay-root.Mui-selected:hover': {color: '#FFFFFF',backgroundColor: '#212121',},
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            orientation='landscape'
            value={dayjs(value)}
            onChange={(newValue) => showSched(newValue)}
            showDaysOutsideCurrentMonth
            slots={{
              day: (DayComponentProps) => {
                  const isDone = !DayComponentProps.outsideCurrentMonth && highlighteddays.includes(DayComponentProps.day.format('MM/DD/YYYY').toString()) && dayjs(DayComponentProps.day.format('MM/DD/YYYY').toString()).isBefore(dayjs().format('MM/DD/YYYY').toString());
                  const isSelected = !DayComponentProps.outsideCurrentMonth && highlighteddays.includes(DayComponentProps.day.format('MM/DD/YYYY').toString()) && dayjs(DayComponentProps.day.format('MM/DD/YYYY').toString()).isSameOrAfter(dayjs().format('MM/DD/YYYY').toString());
                  return (
                  <Badge
                    key={DayComponentProps.day.format('MM/DD/YYYY').toString()}
                    overlap="circular"
                    badgeContent={isSelected ? '🔔' : isDone ? '✔️' : undefined}
                  >
                    <PickersDay {...DayComponentProps} />
                  </Badge>
                  );
              },
              }}
              slotProps={{
                day:{
                  highlighteddays,
                }
              }}
              />
              <div className="schedule-card-holder">
                  <div className="sched-holder">
                    <div className="sched-title">
                    <p>Schedule for {finalValue}</p>  
                  </div>
                  <div className="sched-content">
                    {loading ? <div className="load-container"><span class="loader"></span></div> :<p>{schedule}</p> }
                  </div>
                </div>
              </div>
            </div>
      </LocalizationProvider>
    );
    
  };

  export default Calendar
  