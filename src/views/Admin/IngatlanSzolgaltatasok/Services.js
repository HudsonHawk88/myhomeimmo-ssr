import { Microservices } from '../../../../shared/MicroServices';
const location = __isBrowser__ ? window.location : {};
const ingatlanSzolgAdminUrl = __isBrowser__ && location.origin + '/api/admin/ingatlanszolg';

export default class Services {
    // INGATLAN SZOLG START

    static listIngatlanSzolgaltatasok = (fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgAdminUrl,
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

    static getIngatlanSzolgaltatas = (id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgAdminUrl,
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

    static addIngatlanSzolgaltatas = (data, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*  'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static editIngatlanSzolgaltatas = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*       'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static deleteIngatlanSzolgaltatas = (id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgAdminUrl,
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

    static deleteImage = (filename, adminIngSzolgId, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgAdminUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: adminIngSzolgId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // INGATLAN SZOLG END
}
