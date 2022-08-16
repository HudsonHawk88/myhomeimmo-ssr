import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const orszagokUrl = location.origin + '/api/orszagok';
const telepulesekUrl = location.origin + '/api/telepulesek';
const adminUsersUrl = location.origin + '/api/admin/users';
const rolesUrl = location.origin + '/api/admin/roles';

export default class Services {
    // ORSZAGOK START

    static listOrszagok = () => {
        let result = Microservices.fetchApi(orszagokUrl, {
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

    static listOrszagokLike = (like) => {
        let result = Microservices.fetchApi(orszagokUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                like: like
            }
        });

        return result;
    };

    // ORSZAGOK END

    // TELEPÜLÉSEK START

    static listTelepulesek = () => {
        let result = Microservices.fetchApi(telepulesekUrl, {
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

    static getTelepulesById = (id) => {
        let result = Microservices.fetchApi(telepulesekUrl, {
            method: 'GET',
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

    static getTelepulesByIrsz = (irsz) => {
        let result = Microservices.fetchApi(telepulesekUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                irsz: irsz
            }
        });

        return result;
    };

    static listTelepulesekLike = (like) => {
        let result = Microservices.fetchApi(telepulesekUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                like: like
            }
        });

        return result;
    };

    // TELEPÜLÉSEK END

    // ROLES START

    static getRoles = () => {
        let result = Microservices.fetchApi(rolesUrl, {
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

    // ROLES END

    static listAdminUsers = () => {
        let result = Microservices.fetchApi(adminUsersUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
            }
        });

        return result;
    };

    static getAdminUser = (id) => {
        let result = Microservices.fetchApi(adminUsersUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                id: id
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
            }
        });

        return result;
    };

    static addAdminUser = (adminUser) => {
        let result = Microservices.fetchApi(adminUsersUrl, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                // "Content-Type": "application/json",
                // "Accept": "application/json",
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
            },
            body: adminUser
        });

        return result;
    };

    static editAdminUser = (adminUser, id) => {
        let result = Microservices.fetchApi(adminUsersUrl, {
            method: 'PUT',
            cache: 'no-cache',
            headers: {
                // "Content-Type": "application/json",
                // "Accept": "application/json",
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                id: id
            },
            body: adminUser
        });

        return result;
    };

    static deleteAdminUser = (id) => {
        let result = Microservices.fetchApi(adminUsersUrl, {
            method: 'DELETE',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                id: id
            }
        });

        return result;
    };
}
