import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const gdprUrl = location.origin + '/api/adatkezeles';
const gdprAdminUrl = location.origin + '/api/admin/adatkezeles';

export default class Services {
    // GDPR START

    static listGdpr = (fnDone) => {
        let result = Microservices.fetchApi(
            gdprUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                }
            },
            fnDone
        );

        return result;
    };

    static getGdpr = (id, fnDone) => {
        let result = Microservices.fetchApi(
            gdprAdminUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    'Content-Type': 'application/json',
                    id: id
                }
            },
            fnDone
        );

        return result;
    };

    static addGdpr = (data, fnDone) => {
        let result = Microservices.fetchApi(
            gdprAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(data)
            },
            fnDone
        );
        return result;
    };

    static editGdpr = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            gdprAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: JSON.stringify(data)
            },
            fnDone
        );

        return result;
    };

    static deleteGdpr = (id, fnDone) => {
        let result = Microservices.fetchApi(
            gdprAdminUrl,
            {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                }
            },
            fnDone
        );

        return result;
    };

    // GDPR END
}
