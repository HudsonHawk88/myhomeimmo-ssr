import { Microservices } from './MicroServices';

import Login from '../src/views/Pages/Login/Login';
import Fooldal from '../src/views/Public/Fooldal/Fooldal';
import Ingatlan from '../src/views/Public/Ingatlanok/Ingatlan';
import Ingatlanok from '../src/views/Public/Ingatlanok/Ingatlanok';
import IngatlanSzolgaltatasok from '../src/views/Public/IngatlanSzolgaltatasok/IngatlanSzolgaltatasok';
import PenzugyiSzolgaltatasok from '../src/views/Public/PenzugyiSzolgaltatasok/PenzugyiSzolgaltatasok';
import Adatkezeles from '../src/views/Public/GDPR/Adatkezeles';
import Rolunk from '../src/views/Public/Rolunk/Rolunk';
import Kapcsolat from '../src/views/Public/Kapcsolat/Kapcsolat';
import MyJob from '../src/views/Public/MyJob/MyJob';
import MyArt from '../src/views/Public/MyArt/MyArt';

const getReqUrl = (path) => {
    let origin = '';
    let url = '';
    if (typeof window !== 'undefined') {
        origin = window.location.host;
        url = `http://${origin}${path}`;
    } else {
        url = `http://localhost:3000${path}`;
    }
    /*   console.log(url) */
    return url;
};

const PublicRoutes = [
    { path: '/login', element: Login },
    { path: '/', element: Fooldal, fetchInitialData: (path = `/api/ingatlan`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/ingatlan', element: Ingatlan, fetchInitialData: (path = `/api/ingatlan`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/ingatlanok', element: Ingatlanok, fetchInitialData: (path = `/api/ingatlan`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/ingatlanszolgaltatasok', element: IngatlanSzolgaltatasok, fetchInitialData: (path = `/api/ingatlanszolg`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/penzugyiszolgaltatasok', element: PenzugyiSzolgaltatasok, fetchInitialData: (path = `/api/penzugyszolg`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/adatkezeles', element: Adatkezeles, fetchInitialData: (path = `/api/adatkezeles`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/rolunk', element: Rolunk, fetchInitialData: (path = `/api/rolunk`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/kapcsolat', element: Kapcsolat, fetchInitialData: (path = `/api/kapcsolat`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/myjob', element: MyJob, fetchInitialData: (path = `/api/myjob`) => Microservices.fetchApi(getReqUrl(path)) },
    { path: '/myart', element: MyArt, fetchInitialData: (path = `/api/myart`) => Microservices.fetchApi(getReqUrl(path)) }
];

export default PublicRoutes;
