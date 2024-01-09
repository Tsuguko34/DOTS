import React from 'react'
import './Pages.css'
import RequestHistoryTable from './RequestHistoryTable'

function RequestHistory() {
    return (
        <section className='monitoring'>
            <div className='page-title'>
              <p>Dean's Office Transaction</p>
              <p>Request History</p>
              <div className='page-desc'>Dean's office transaction request history</div>
            </div>
            <div className="monitoring-content-holder">
              <div className="table-holder">
                <RequestHistoryTable />
              </div>
            </div>
            
        </section>
      )
}

export default RequestHistory