import React from 'react';
import { Route } from 'react-router-dom';

const ProtectedRoute = ({ path, element: Element, index, exact, ...rest }) => {
    return <Route path={path} element={(props) => <Element {...props} />} index={index} exact={exact} {...rest} />;
};

export default ProtectedRoute;
