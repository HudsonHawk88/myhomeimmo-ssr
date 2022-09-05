import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const getClassName = (classname, to) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  return match ? `${classname} active` : classname;
};

const NavLink = ({ children, to, className, ...props }) => {
  return (
    <div>
      <Link to={to} className={getClassName(className, to)} {...props}>
        {children}
      </Link>
    </div>
  );
};

export default NavLink;
