import React from 'react'
import './Pages.css'
import OtherDocumentsTable from './OtherDocumentsTable'

function OtherDocuments() {
    return (
        <section className='monitoring'>
            <div className='page-title'>
              <p>Dean's Office Transaction</p>
              <p>Other Documents</p>
              <div className='page-desc'>Dean's office transaction other documents</div>
            </div>
            <div className="monitoring-content-holder">
              <div className="table-holder">
                <OtherDocumentsTable />
              </div>
            </div>
            
        </section>
    )
}

export default OtherDocuments