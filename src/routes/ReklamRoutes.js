import React from "react";
import { useRoutes, useLocation } from "react-router-dom";

import Reklam from "../views/Public/Reklam/Reklam";

const ReklamRoutes = (props) => {
  let { history } = props;
  let location = useLocation();
  const routes = {
    path: "/reklam",
    element: <Reklam history={history} location={location} {...props} />,
  };
  const routing = useRoutes([routes]);

  return <React.Fragment>{routing}</React.Fragment>;
};

export default ReklamRoutes;
