import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import PublicHeader from '../components/Header/PublicHeader';
import PublicFooter from '../components/Footer/PublicFooter';
import PublicHeaderCarousel from '../components/Header/PublicHeaderCarousel';
import Loading from '../commons/Loading';

const Public = (props) => {
    const { children, data, isAdmin } = props;
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    /*  console.log('PUBLICING: ', data); */

    useEffect(() => {
        if (data || location.pathname === '/login') {
            setLoading(false);
        }

        return () => {
            setLoading(true);
        };
    }, [data, location.pathname]);

    return location.pathname === '/login' && !isAdmin ? (
        <React.Fragment>{children}</React.Fragment>
    ) : (
        <React.Fragment>
            <div className="public_full">
                <header>
                    <PublicHeader {...props} />
                </header>
                {loading ? (
                    <div className="tartalom">
                        <Loading isLoading={loading} />
                    </div>
                ) : (
                    <React.Fragment>
                        {__isBrowser__ && location.pathname === '/' && location.pathname !== '/login' && <PublicHeaderCarousel ingatlanok={data} />}
                        <div className="tartalom">{children}</div>
                        {/* 
                            <Table bordered striped style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <td>Hello</td>
                                    <td>Hi</td>
                                    <td>Hola</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                </tr>
                            </tbody>
                        </Table>
                    
                        */}
                    </React.Fragment>
                )}
                <PublicFooter mainUrl={props.mainUrl} />
            </div>
        </React.Fragment>
    );
};

export default Public;
