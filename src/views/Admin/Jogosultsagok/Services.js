import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const roleUrl = location.origin + '/api/admin/roles';

export default class Services {
    static listRoles = (fnDone) => {
        let result = Microservices.fetchApi(
            roleUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                }
            },
            fnDone
        );

        return result;
    };

    static getRole = (id, fnDone) => {
        let result = Microservices.fetchApi(
            roleUrl,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    id: id
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                }
            },
            fnDone
        );

        return result;
    };

    static addRole = (roleObj, fnDone) => {
        let result = Microservices.fetchApi(
            roleUrl,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                },
                body: JSON.stringify(roleObj)
            },
            fnDone
        );

        return result;
    };

    static editRole = (roleObj, id, fnDone) => {
        let result = Microservices.fetchApi(
            roleUrl,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                    id: id
                },
                body: JSON.stringify(roleObj)
            },
            fnDone
        );

        return result;
    };

    static deleteRole = (id, fnDone) => {
        let result = Microservices.fetchApi(
            roleUrl,
            {
                method: 'DELETE',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                    id: id
                }
            },
            fnDone
        );

        return result;
    };
}
