import React from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/Header/AdminHeader";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import AdminFooter from "../components/Footer/AdminFooter";

const Admin = (props) => {
  const { children } = props;
  return (
    <div className="admin_full">
      <AdminHeader {...props} />
      <main className="admin_content">
        <AdminSidebar {...props} />
        <div className="tartalom-admin">{children}</div>
      </main>
      <AdminFooter />
    </div>
  );
};

export default Admin;
