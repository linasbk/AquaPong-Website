import React from 'react';
import Profile from '../../components/settings/Profile';
import Security from '../../components/settings/Security';
import './settingPage.css';

const SettingsPage = () => {
  return (
    <div className="col-start-2  row-start-2 w-full h-full p-4 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 removeScroll gap-4 w-full max-w-6xl ">
        <Profile />
        <Security />
      </div>
    </div>
  ); 
}

export default SettingsPage;