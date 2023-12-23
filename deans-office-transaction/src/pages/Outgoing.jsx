import React, { useEffect, useReducer, useRef, useState } from 'react'
import './Pages.css'
import dayjs from 'dayjs';
import OutgoingTable from './OutgoingTable'
import DateandProfile from '../components/DateandProfile';

function Outgoing() {

  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Monitoring</p>
          <div className='page-desc'>Dean's office transaction outgoing documents</div>
        </div>
        <div className="monitoring-content-holder">
          <div className="table-holder">
            <OutgoingTable/>
          </div>
        </div>
    </section>
  )
}

function prePage(){

}


export default Outgoing