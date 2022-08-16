import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Public from '../containers/Public';
import PublicRoutes from '../../shared/PublicRoutes';

const Pubroutes = (props) => {
    const getChildRoutes = (children) =>
        children && children.map(({ path, element: Component, index, children, ...rest }) => <Route key={path} path={path} index={index} element={<Component {...props} {...rest} />} />);

    const getMainRoutes = () =>
        PublicRoutes &&
        PublicRoutes.length !== 0 &&
        PublicRoutes.map(({ path, element: Component, index, children, ...rest }) =>
            children ? getChildRoutes(children) : <Route key={path} path={path} index={index} element={<Component {...props} {...rest} />} />
        );

    return (
        <Public {...props}>
            <Routes>{getMainRoutes()}</Routes>
        </Public>
    );
};

export default Pubroutes;
