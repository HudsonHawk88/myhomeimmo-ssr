import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginRoutes from '../../shared/LoginRoutes';

const Logroutes = (props) => {
    const { isAdmin, user } = props;
    const getMainRoutes = () =>
        LoginRoutes &&
        LoginRoutes.length !== 0 &&
        LoginRoutes.map(({ path, element: Component, index, children, ...rest }) => <Route key={path} path={path} index={index} element={<Component {...props} {...rest} />} />);

    return (
        <React.Fragment>
            <Routes>{getMainRoutes()}</Routes>
        </React.Fragment>
    );
};

export default Logroutes;
