import React from 'react'
import './Pages.css'
import IncomingMemoTable from './IncomingMemoTable'

function IncomingMemo() {
    return (
        <section className='monitoring'>
            <div className='page-title'>
              <p>Dean's Office Transaction</p>
              <p>Monitoring</p>
              <div className='page-desc'>Dean's office transaction incoming memorandums</div>
            </div>
            <div className="monitoring-content-holder">
              <div className="table-holder">
                <IncomingMemoTable />
              </div>
            </div>
            
        </section>
      )
}

export default IncomingMemo