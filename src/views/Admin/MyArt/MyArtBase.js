import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import classnames from 'classnames';

import MyArtAltalanos from './MyArtAltalanos';
import MyArtGaleriak from './MyArtGaleriak';

const MyArtBase = (props) => {
    const { history } = props;
    const [active, setActive] = useState('1');

    const toggle = (id) => {
        setActive(id);
    };

    const init = () => {
        setActive('1');
        /* history.push('/admin/myart/altalanos'); */
    };

    useEffect(() => {
        init();
    }, []);

    const renderContents = () => {
        return (
            <div>
                <Nav tabs card className="tab_nav">
                    <NavItem>
                        <NavLink
                            /* to="/admin/myart/altalanos" */
                            className={classnames({ active: active === '1' })}
                            history={history}
                            onClick={() => toggle('1')}
                        >
                            Általános
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            /* to="/admin/myart/galeriak" */
                            className={classnames({ active: active === '2' })}
                            history={history}
                            onClick={() => toggle('2')}
                        >
                            Galériák
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={active}>
                    <TabPane tabId="1">
                        <MyArtAltalanos {...props} />
                    </TabPane>
                    <TabPane tabId="2">
                        <MyArtGaleriak {...props} />
                    </TabPane>
                </TabContent>
            </div>
        );
    };

    return (
        <div className="row">
            <div className="col-md-12">{renderContents()}</div>
        </div>
    );
};

export default MyArtBase;
