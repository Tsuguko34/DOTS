import React, { useEffect } from 'react'
import {Routes, Route, useParams } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Incoming from '../pages/Incoming';
import Outgoing from '../pages/Outgoing';
import Archives from '../pages/Archives';
import Templates from '../pages/Templates';
import SidebarLayout from './SideBarLayout'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp';
import PrivateRoutes from './PrivateRoute';
import { AuthContextProvider } from './AuthContext';
import Settings from '../pages/Settings';
import IncomingMemo from '../pages/IncomingMemo';
import OutgoingMemo from '../pages/OutgoingMemo';
import MOA from '../pages/MOA';
import ArchiveMainTable from '../pages/ArchiveMainTable';
import PendingLetters from '../pages/PendingLetters';
import ApprovedLetters from '../pages/ApprovedLetters';
import RejectedLetters from '../pages/RejectedLetters';
import RequestHistory from '../pages/RequestHistory';
import OtherDocuments from '../pages/OtherDocuments';
import RoleBasedRoutes from './RoleBasedRoutes';
import SettingsRoute from './SettingsRoute';
import Verification from '../pages/verification';
import CompleteDetails from '../pages/CompleteDetails';
import SysSettings from '../pages/SysSettings';
import SysSettingsRoute from './SysSettingsRoute';

function Navpages() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<SidebarLayout/>}>
            <Route path='/pages/Dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
            <Route path='/pages/Incoming' element={<PrivateRoutes><RoleBasedRoutes><Incoming /></RoleBasedRoutes></PrivateRoutes>} />
            <Route path='/pages/Outgoing' element={<PrivateRoutes><RoleBasedRoutes><Outgoing /></RoleBasedRoutes></PrivateRoutes>} />
            <Route path='/pages/Archives' element={<PrivateRoutes><Archives /></PrivateRoutes>} />
            <Route path='/pages/Templates' element={<PrivateRoutes><Templates /></PrivateRoutes>} />
            <Route path='/pages/Settings' element={<PrivateRoutes><Settings /></PrivateRoutes>} />
            <Route path='/pages/SysSettings' element={<PrivateRoutes><SysSettingsRoute><SysSettings /></SysSettingsRoute></PrivateRoutes>} />
            <Route path='/pages/IncomingMemo' element={<PrivateRoutes><RoleBasedRoutes><IncomingMemo /></RoleBasedRoutes></PrivateRoutes>} />
            <Route path='/pages/OutgoingMemo' element={<PrivateRoutes><RoleBasedRoutes><OutgoingMemo /></RoleBasedRoutes></PrivateRoutes>} />
            <Route path='/pages/Archives/pages/ArchiveMainTable/:documentType/:year' element={<PrivateRoutes><ArchiveMainTable /></PrivateRoutes>} />
            <Route path='/pages/MOA' element={<PrivateRoutes><MOA /></PrivateRoutes>} />
            <Route path='/pages/PendingLetters' element={<PrivateRoutes><PendingLetters /></PrivateRoutes>} />
            <Route path='/pages/ApprovedLetters' element={<PrivateRoutes><ApprovedLetters /></PrivateRoutes>} />
            <Route path='/pages/RejectedLetters' element={<PrivateRoutes><RejectedLetters /></PrivateRoutes>} />
            <Route path='/pages/RequestHistory' element={<PrivateRoutes><RequestHistory /></PrivateRoutes>} />
            <Route path='/pages/OtherDocuments' element={<PrivateRoutes><OtherDocuments /></PrivateRoutes>} />
            
        </Route>
        <Route path='/' index element={<Login />}/>
        <Route path='/pages/Login' element={<Login />}/>
        <Route path='/pages/SignUp' element={<SignUp />}/>
        <Route path='/pages/CompleteDetails' element={<SettingsRoute><CompleteDetails /></SettingsRoute>} />
        <Route path='/verify/:token' element={<Verification />}/>
      </Routes>
    </AuthContextProvider>
    
  )
}

export default Navpages