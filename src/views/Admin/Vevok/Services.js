import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const orszagokUrl = location.origin + '/api/orszagok';
const telepulesekUrl = location.origin + '/api/telepulesek';
const adminVevokUrl = location.origin + '/api/admin/vevok';
const rolesUrl = location.origin + '/api/admin/roles';
const optionsUrl = location.origin + '/api/options';

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

    static listAdminVevok = () => {
        let result = Microservices.fetchApi(adminVevokUrl, {
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

    static getAdminVevo = (id) => {
        let result = Microservices.fetchApi(adminVevokUrl, {
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

    static addAdminVevo = (adminVevo) => {
        let result = Microservices.fetchApi(adminVevokUrl, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                // "Accept": "application/json",
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
            },
            body: JSON.stringify(adminVevo)
        });

        return result;
    };

    static editAdminVevo = (adminVevo, id) => {
        let result = Microservices.fetchApi(adminVevokUrl, {
            method: 'PUT',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                // "Accept": "application/json",
                // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                id: id
            },
            body: JSON.stringify(adminVevo)
        });

        return result;
    };

    static deleteAdminVevo = (id) => {
        let result = Microservices.fetchApi(adminVevokUrl, {
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

      static kiajanl = (id) => {
        let result = Microservices.fetchApi(adminVevokUrl + '/kiajanl', {
            method: 'POST',
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


        // OPTIONS START

    static getAltipusOptions = () => {
        let result = Microservices.fetchApi(optionsUrl + '/altipusoptions', {
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

    static getIngatlanOptions = () => {
        let result = Microservices.fetchApi(optionsUrl + '/ingatlanoptions', {
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

    // OPTIONS END
}
