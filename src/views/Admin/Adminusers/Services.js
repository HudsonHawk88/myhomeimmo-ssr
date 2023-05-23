import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const orszagokUrl = location.origin + '/api/orszagok';
const telepulesekUrl = location.origin + '/api/telepulesek';
const adminUsersUrl = location.origin + '/api/admin/users';
const rolesUrl = location.origin + '/api/admin/roles';

export default class Services {
    // ORSZAGOK START

    static listOrszagok = (fnDone) => {
        let result = Microservices.fetchApi(
            orszagokUrl,
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

    static listOrszagokLike = (like, fnDone) => {
        let result = Microservices.fetchApi(
            orszagokUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    like: like
                }
            },
            fnDone
        );

        return result;
    };

    // ORSZAGOK END

    // TELEPÜLÉSEK START

    static listTelepulesek = (fnDone) => {
        let result = Microservices.fetchApi(
            telepulesekUrl,
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

    static getTelepulesById = (id, fnDone) => {
        let result = Microservices.fetchApi(
            telepulesekUrl,
            {
                method: 'GET',
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

    static getTelepulesByIrsz = (irsz, fnDone) => {
        let result = Microservices.fetchApi(
            telepulesekUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    irsz: irsz
                }
            },
            fnDone
        );

        return result;
    };

    static listTelepulesekLike = (like, fnDone) => {
        let result = Microservices.fetchApi(
            telepulesekUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    like: like
                }
            },
            fnDone
        );

        return result;
    };

    // TELEPÜLÉSEK END

    // ROLES START

    static getRoles = (fnDone) => {
        let result = Microservices.fetchApi(
            rolesUrl,
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

    // ROLES END

    static listAdminUsers = (fnDone) => {
        let result = Microservices.fetchApi(
            adminUsersUrl,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                }
            },
            fnDone
        );

        return result;
    };

    static getAdminUser = (id, fnDone) => {
        let result = Microservices.fetchApi(
            adminUsersUrl,
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

    static addAdminUser = (adminUser, fnDone) => {
        let result = Microservices.fetchApi(
            adminUsersUrl,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    // "Content-Type": "application/json",
                    // "Accept": "application/json",
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                },
                body: adminUser
            },
            fnDone
        );

        return result;
    };

    static editAdminUser = (adminUser, id, fnDone) => {
        let result = Microservices.fetchApi(
            adminUsersUrl,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    // "Content-Type": "application/json",
                    // "Accept": "application/json",
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                    id: id
                },
                body: adminUser
            },
            fnDone
        );

        return result;
    };

    static deleteAdminUser = (id, fnDone) => {
        let result = Microservices.fetchApi(
            adminUsersUrl,
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

    static deleteImage = (filename, adminUserId, fnDone) => {
        let result = Microservices.fetchApi(
            adminUsersUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: adminUserId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };
}
