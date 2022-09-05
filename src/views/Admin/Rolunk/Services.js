import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const rolunkAdminUrl = location.origin + '/api/admin/rolunk';

export default class Services {
    // ROLUNK START

    static listRolunk = () => {
        let result = Microservices.fetchApi(rolunkAdminUrl, {
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

    static getRolunk = (id) => {
        let result = Microservices.fetchApi(rolunkAdminUrl, {
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

    static addRolunk = (data) => {
        let result = Microservices.fetchApi(rolunkAdminUrl, {
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

    static editRolunk = (data, id) => {
        let result = Microservices.fetchApi(rolunkAdminUrl, {
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

    static deleteRolunk = (id) => {
        let result = Microservices.fetchApi(rolunkAdminUrl, {
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

    // ROLUNK END
}
