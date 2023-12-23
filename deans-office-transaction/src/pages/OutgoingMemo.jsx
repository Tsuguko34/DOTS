import React from 'react'
import './Pages.css'
import OutgoingMemoTable from './OutgoingMemoTable'

function OutgoingMemo() {
    return (
        <section className='monitoring'>
            <div className='page-title'>
              <p>Dean's Office Transaction</p>
              <p>Monitoring</p>
              <div className='page-desc'>Dean's office transaction outgoing memorandums</div>
            </div>
            <div className="monitoring-content-holder">
              <div className="table-holder">
                <OutgoingMemoTable />
              </div>
            </div>
        </section>
      )
}

export default OutgoingMemo