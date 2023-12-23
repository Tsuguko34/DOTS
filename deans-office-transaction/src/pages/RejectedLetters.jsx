import React from 'react'
import './Pages.css'
import RejectedLettersTable from './RejectedLettersTable'

function RejectedLetters() {
  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Rejected Letters</p>
          <div className='page-desc'>Dean's office transaction rejected documents</div>
        </div>
        <div className="monitoring-content-holder">
          <div className="table-holder">
            <RejectedLettersTable />
          </div>
        </div>
        
    </section>
  )
}

export default RejectedLetters