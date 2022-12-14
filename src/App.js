import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Route, Redirect } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
/* import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'; */
import Services from './views/Pages/Login/Services';
import Pubroutes from './routes/Publicroutes';
import ReklamRoutes from './routes/ReklamRoutes';
import AdmRoutes from './routes/Adminroutes';
import Login from './views/Pages/Login/Login';
import { hasRole } from './commons/Lib';
import process from 'process';

function App(props) {
    const { history, serverData } = props;
    const [user, setUser] = useState(null);
    const [ertekesito, setErtekesito] = useState(null);
    const [initialData, setInitialData] = useState(() => {
        return __isBrowser__ ? window.__INITIAL_DATA__ : serverData;
    });

    let location = history && history.location;
    const isAdmin = __isBrowser__ && window.location.pathname.startsWith('/admin');

    useEffect(() => {
        setInterval(() => {
            refreshToken();
        }, 60000 * 60);
    }, []);

    /*    useEffect(() => {
        setInitialData(__isBrowser__ ? window.__INITIAL_DATA__ : serverData);
    }, [__isBrowser__]); */

    /*   const [ ingatlanok, setIngatlanok ] = useState([]); */

    /*   const getIngatlanok = () => {
      if (__isBrowser__) {
          setIngatlanok(window.__INITIAL_DATA__);
          delete window.__INITIAL_DATA__;
      } else {
          setIngatlanok(props.staticContext.data);
      }
  }

  useEffect(() => {
      getIngatlanok();
  }, [props]) */

    /* console.log(props.staticContext.data) */

    const createNotification = (type, msg) => {
        switch (type) {
            case 'info':
                NotificationManager.info(msg);
                break;
            case 'success':
                NotificationManager.success(msg);
                break;
            case 'warning':
                NotificationManager.warning(msg);
                break;
            case 'error':
                NotificationManager.error(msg);
                break;
            default:
                NotificationManager.info(msg);
        }
    };

    const refreshToken = () => {
        const token = localStorage ? localStorage.getItem('refreshToken') : '';
        if (token && isAdmin) {
            Services.refreshToken(token, isAdmin).then((res) => {
                if (!res.err) {
                    setUser(res.user);
                    if (res.ertekesito && res.ertekesito !== {}) {
                        setErtekesito(res.ertekesito);
                    }
                }
            });
        }
    };

    const logout = () => {
        const token = localStorage ? localStorage.getItem('refreshToken') : '';
        Services.logout(token, isAdmin).then((res) => {
            if (!res.err) {
                localStorage.removeItem('refreshToken');
                if (__isBrowser__) {
                    window.location.href = '/';
                }
            } else {
                /*  createNotification("error", "V??ratlan hiba a kijelentkez??sn??l! K??rj??k pr??b??ld meg ??jra!"); */
            }
        });
    };

    /*   const getIngatlanok = () => {
    Services.listIngatlanok().then((res) => {
        if (!res.err) {
            let kiemeltIngatlanok = res.filter((ing) => ing.isKiemelt)
            setIngatlanok(kiemeltIngatlanok);
        }
    })
  } */

    /*   useEffect(() => {
    
    const token = localStorage ? localStorage.getItem('refreshToken') : "";
    if (isAdmin) {
      if (token) {
        refreshToken(); 
      }
    }

    
  }, [isAdmin]); */

    useEffect(() => {
        if ((__isBrowser__ && location.pathname.startsWith('/admin')) || location.pathname === '/login') {
            refreshToken();
        }
    }, [location]);

    /*   const scrollToTop = () => {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    });
} */

    /* console.log(global.window.location.href) */
    /* console.log(window) */

    /*   useEffect(() => {
        scrollToTop();

        return () => {
          
        }
  }, [location]); */

    /*   const getInitialDatas = () => {
    if (__isBrowser__) {
      setData(window.__INITIAL_DATA__);
    } else {
      setData(props.staticContext.data);
    }
  } */

    /*   useEffect(() => {
    getInitialDatas();
  }, [__isBrowser__]) */

    /*   console.log('APP INGATLANOK: ', initialData); */

    return (
        <React.Fragment>
            <NotificationContainer />
            {isAdmin && user ? (
                <AdmRoutes
                    history={history}
                    reCaptchaKey={process.env.reachaptchaApiKey}
                    hasRole={hasRole}
                    addNotification={createNotification}
                    ertekesito={ertekesito ? ertekesito : null}
                    user={user}
                    logout={logout}
                />
            ) : location && location.pathname.startsWith('/reklam') ? (
                <ReklamRoutes history={history} addNotification={createNotification} data={initialData} />
            ) : (
                <React.Fragment>
                    <Pubroutes
                        isAdmin={isAdmin}
                        setUser={setUser}
                        setErtekesito={setErtekesito}
                        data={initialData}
                        history={history}
                        reCaptchaKey={process.env.reachaptchaApiKey}
                        addNotification={createNotification}
                    />
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export default App;
