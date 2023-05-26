import { Microservices } from './MicroServices';
import fetch from 'isomorphic-fetch';
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
        url = `http://${process.env.HOST ? process.env.HOST : '127.0.0.1'}:${process.env.PORT ? process.env.PORT : '3000'}${path}`;
    }

    return url;
};

const PublicRoutes = [
    { path: '/login', element: Login },
    { path: '/', element: Fooldal },
    { path: '/ingatlan', element: Ingatlan },
    { path: '/ingatlanok', element: Ingatlanok },
    { path: '/ingatlanszolgaltatasok', element: IngatlanSzolgaltatasok },
    { path: '/penzugyiszolgaltatasok', element: PenzugyiSzolgaltatasok },
    { path: '/adatkezeles', element: Adatkezeles },
    { path: '/rolunk', element: Rolunk },
    { path: '/kapcsolat', element: Kapcsolat },
    { path: '/myjob', element: MyJob },
    { path: '/myart', element: MyArt }
];

export default PublicRoutes;
