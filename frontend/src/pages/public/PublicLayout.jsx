import React from 'react'
import { PublicNavigate } from './PublicNavigate'
import { Outlet } from 'react-router'

export const PublicLayout = () => {
  return (
    <div className='w-full min-h-screen relative overflow-hidden'>
      <PublicNavigate>
        <Outlet/>
      </PublicNavigate>
    </div>
  )
}

export default PublicLayout;
