import React, { useRef, useState, useEffect } from 'react'
import './Pages.css'
import dayjs from 'dayjs';
import IncomingTable from './IncomingTable'
import DateandProfile from '../components/DateandProfile';

function Incoming(){
  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Monitoring</p>
          <div className='page-desc'>Dean's office transaction incoming documents</div>
        </div>
        <div className="monitoring-content-holder">
          <div className="table-holder">
            <IncomingTable/>
          </div>
        </div>
        
    </section>
  )
}

export default Incoming