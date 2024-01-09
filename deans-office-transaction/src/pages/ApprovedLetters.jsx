import React from 'react'
import './Pages.css'
import ApprovedLettersTable from './ApprovedLettersTable'

function ApprovedLetters() {
  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Approved Letters</p>
          <div className='page-desc'>Dean's office transaction approved documents</div>
        </div>
        <div className="monitoring-content-holder">
          <div className="table-holder">
            <ApprovedLettersTable />
          </div>
        </div>
        
    </section>
  )
}

export default ApprovedLetters