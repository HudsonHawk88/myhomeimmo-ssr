import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const orszagokUrl = location.origin + '/api/orszagok';
const telepulesekUrl = location.origin + '/api/telepulesek';
const adminVevokUrl = location.origin + '/api/admin/vevok';
const rolesUrl = location.origin + '/api/admin/roles';
const optionsUrl = location.origin + '/api/options';

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

    static listAdminVevok = (fnDone) => {
        let result = Microservices.fetchApi(
            adminVevokUrl,
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

    static getAdminVevo = (id, fnDone) => {
        let result = Microservices.fetchApi(
            adminVevokUrl,
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

    static addAdminVevo = (adminVevo, fnDone) => {
        let result = Microservices.fetchApi(
            adminVevokUrl,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                    // "Accept": "application/json",
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                },
                body: JSON.stringify(adminVevo)
            },
            fnDone
        );

        return result;
    };

    static editAdminVevo = (adminVevo, id, fnDone) => {
        let result = Microservices.fetchApi(
            adminVevokUrl,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    // "Accept": "application/json",
                    // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                    id: id
                },
                body: JSON.stringify(adminVevo)
            },
            fnDone
        );

        return result;
    };

    static deleteAdminVevo = (id, fnDone) => {
        let result = Microservices.fetchApi(
            adminVevokUrl,
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

    static kiajanl = (id, fnDone) => {
        let result = Microservices.fetchApi(
            adminVevokUrl + '/kiajanl',
            {
                method: 'POST',
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

    // OPTIONS START

    static getAltipusOptions = (fnDone) => {
        let result = Microservices.fetchApi(
            optionsUrl + '/altipusoptions',
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

    static getIngatlanOptions = (fnDone) => {
        let result = Microservices.fetchApi(
            optionsUrl + '/ingatlanoptions',
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

    // OPTIONS END
}
