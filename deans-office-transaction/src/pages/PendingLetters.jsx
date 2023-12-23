import React from 'react'
import './Pages.css'
import PendingLettersTable from './PendingLettersTable'

function PendingLetters() {
  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Pending Letters</p>
          <div className='page-desc'>Dean's office transaction pending documents</div>
        </div>
        <div className="monitoring-content-holder">
          <div className="table-holder">
            <PendingLettersTable />
          </div>
        </div>
        
    </section>
  )
}

export default PendingLetters