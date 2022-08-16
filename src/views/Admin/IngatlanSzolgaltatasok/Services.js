import { Microservices } from '../../../../shared/MicroServices';
const location = __isBrowser__ ? window.location : {};
const ingatlanSzolgAdminUrl = __isBrowser__ && location.origin + '/api/admin/ingatlanszolg';

export default class Services {
    // INGATLAN SZOLG START

    static listIngatlanSzolgaltatasok = () => {
        let result = Microservices.fetchApi(ingatlanSzolgAdminUrl, {
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

    static getIngatlanSzolgaltatas = (id) => {
        let result = Microservices.fetchApi(ingatlanSzolgAdminUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                'Content-Type': 'application/json',
                id: id
            }
        });

        return result;
    };

    static addIngatlanSzolgaltatas = (data) => {
        let result = Microservices.fetchApi(ingatlanSzolgAdminUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: JSON.stringify(data)
        });
        return result;
    };

    static editIngatlanSzolgaltatas = (data, id) => {
        let result = Microservices.fetchApi(ingatlanSzolgAdminUrl, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: id
            },
            body: JSON.stringify(data)
        });
        return result;
    };

    static deleteIngatlanSzolgaltatas = (id) => {
        let result = Microservices.fetchApi(ingatlanSzolgAdminUrl, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: id
            }
        });
        return result;
    };

    // INGATLAN SZOLG END
}
