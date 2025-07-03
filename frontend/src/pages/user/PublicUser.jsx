import React from 'react';
import { menuNavBarItemsUser } from '../../utils/constant';
import { Outlet } from 'react-router-dom';

export const PublicUser = () => {
  return (
    <div className="w-full flex-wrap flex justify-end">
      
        <Outlet />
      
    </div>
  )
}

export default PublicUser;