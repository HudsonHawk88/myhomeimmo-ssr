import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminRoutes from '../../shared/AdminRoutes';
import Admin from '../containers/Admin';

const Admroutes = (props) => {
    const getChildRoutes = (children) =>
        children && children.map(({ path, element: Component, index, children, ...rest }) => <Route key={path} path={path} index={index} element={<Component {...props} {...rest} />} />);

    const getMainRoutes = () =>
        AdminRoutes &&
        AdminRoutes.length !== 0 &&
        AdminRoutes.map(({ path, element: Component, index, children, ...rest }) =>
            children ? getChildRoutes(children) : <Route key={path} path={path} index={index} element={<Component {...props} {...rest} />} />
        );

    return (
        <Admin {...props}>
            <Routes>{getMainRoutes()}</Routes>
        </Admin>
    );
};

export default Admroutes;
