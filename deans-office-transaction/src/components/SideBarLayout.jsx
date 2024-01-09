import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'
import DateandProfile from './DateandProfile';
import { useState } from 'react';
const SidebarLayout = () => (
    <>
      <div className="body">
            <div className="nav-sidebar">
              <Sidebar className="nav-sidebar"/>
            </div>
            <div className="content">
              <DateandProfile/>
              <Outlet/>
            </div>
        </div>
    </>
  );

  export default SidebarLayout