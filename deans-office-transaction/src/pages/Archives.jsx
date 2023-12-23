import React, { useState, useEffect } from 'react'
import './Pages.css'
import dayjs from 'dayjs';
import ArchiveTable from './ArchiveTable'
import DateandProfile from '../components/DateandProfile';

function Archives() {

  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Archives</p>
        </div>
        <div className="monitoring-content-holder">
          <div className="table-holder">
            <ArchiveTable/>
          </div>
        </div>
    </section>
  )
}

export default Archives