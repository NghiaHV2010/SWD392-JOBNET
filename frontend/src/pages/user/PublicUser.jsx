import React from "react";
import { menuItems } from "./Navbar";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export const PublicUser = () => {
  return (
    <Navigation menuNavbar={menuItems}>
      <Outlet />
    </Navigation>
  );
};

export default PublicUser;
