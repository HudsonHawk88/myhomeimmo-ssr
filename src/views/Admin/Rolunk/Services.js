import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const rolunkAdminUrl = location.origin + '/api/admin/rolunk';

export default class Services {
    // ROLUNK START

    static listRolunk = (fnDone) => {
        let result = Microservices.fetchApi(
            rolunkAdminUrl,
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

    static getRolunk = (id, fnDone) => {
        let result = Microservices.fetchApi(
            rolunkAdminUrl,
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

    static addRolunk = (data, fnDone) => {
        let result = Microservices.fetchApi(
            rolunkAdminUrl,
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

    static editRolunk = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            rolunkAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*          'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static deleteRolunk = (id, fnDone) => {
        let result = Microservices.fetchApi(
            rolunkAdminUrl,
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

    static deleteImage = (filename, rolunkId, fnDone) => {
        let result = Microservices.fetchApi(
            rolunkAdminUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: rolunkId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // ROLUNK END
}
