import { Microservices } from '../../../../shared/MicroServices';

const location = typeof window !== 'undefined' ? window.location : {};

const loginUrl = location.origin + '/api/admin/login';

const adminLoginUrl = location.origin + '/api/admin/login';

const tokenUrl = location.origin + '/api/admin/token';

const adminTokenUrl = location.origin + '/api/admin/token';

const logoutUrl = location.origin + '/api/logout';

const adminLogoutUrl = location.origin + '/api/admin/logout';

const ingatlanokUrl = location.origin + '/';

export default class Services {
    static login = (user, isAdmin, fnDone) => {
        const logUrl = isAdmin ? adminLoginUrl : loginUrl;
        let result = Microservices.fetchApi(
            logUrl,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                },
                body: JSON.stringify(user)
            },
            fnDone
        );
        return result;
    };

    static logout = (token, isAdmin, fnDone) => {
        const url = isAdmin ? adminLogoutUrl : logoutUrl;
        let result = Microservices.fetchApi(
            url,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    token: token
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                }
            },
            fnDone
        );
        return result;
    };

    static refreshToken = (refreshToken, isAdmin, fnDone) => {
        const tokUrl = isAdmin ? adminTokenUrl : tokenUrl;
        let result = Microservices.fetchApi(
            tokUrl,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    refreshToken: refreshToken
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                }
            },
            fnDone
        );
        return result;
    };

    static listIngatlanok = () => {
        let result = Microservices.fetchApi(ingatlanokUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            }
        });

        return result;
    };
}
