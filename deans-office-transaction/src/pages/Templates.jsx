import React, { useState, useEffect } from 'react'
import './Pages.css'
import letter from '../Images/letter.png';

import { Dialog, DialogContent, DialogTitle} from '@mui/material';
import { auth, db, firestore, storage } from '../firebase';
import noresult from '../Images/noresults.png'
import {addDoc, collection, deleteDoc, doc, endBefore, getDoc, getDocs, limit, limitToLast, orderBy, query, startAfter, updateDoc, where} from 'firebase/firestore'
import { v4 as uuid } from 'uuid';
import {ref, uploadBytes, getDownloadURL, getStorage, listAll, getMetadata} from 'firebase/storage';
import { Document } from 'react-pdf'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import TemplatesTable from './TemplatesTable'
import DateandProfile from '../components/DateandProfile';


function Templates() {

  return (
    <section className='monitoring'>
        <div className='page-title'>
          <p>Dean's Office Transaction</p>
          <p>Templates</p>
        </div>   
        <TemplatesTable/>
    </section>
  )
}

export default Templates