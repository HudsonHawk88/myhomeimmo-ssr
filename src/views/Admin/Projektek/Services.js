import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};

const ingatlanokUrl = location.origin + '/api/ingatlan';
const orszagokUrl = location.origin + '/api/orszagok';
const telepulesekUrl = location.origin + '/api/telepulesek';
const projektekUrl = location.origin + '/api/admin/projektek';
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

    // TELEPULESEK END

    // OPTS START

    static getOptions = (fnDone) => {
        let result = Microservices.fetchApi(
            optionsUrl + '/ingatlanoptions',
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            },
            fnDone
        );

        return result;
    };

    static getProjektIngatlanokOpts = (fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokUrl + '/ingatlanids',
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            },
            fnDone
        );

        return result;
    };

    // OPTS END

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

    // PROJEKTEK START

    static listProjektek = (fnDone) => {
        let result = Microservices.fetchApi(
            projektekUrl,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            },
            fnDone
        );

        return result;
    };

    static getProjekt = (id, fnDone) => {
        let result = Microservices.fetchApi(
            projektekUrl,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    id: id
                }
            },
            fnDone
        );

        return result;
    };

    static addProjekt = (projektObj, fnDone) => {
        let result = Microservices.fetchApi(
            projektekUrl,
            {
                method: 'POST',
                cache: 'no-cache',
                body: projektObj
            },
            fnDone
        );

        return result;
    };

    static editProjekt = (projektObj, id, fnDone) => {
        let result = Microservices.fetchApi(
            projektekUrl,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    id: id
                },
                body: projektObj
            },
            fnDone
        );

        return result;
    };

    static deleteProjekt = (id, fnDone) => {
        let result = Microservices.fetchApi(
            projektekUrl,
            {
                method: 'DELETE',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    id: id
                }
            },
            fnDone
        );

        return result;
    };

    static deleteImage = (filename, projektId, fnDone) => {
        let result = Microservices.fetchApi(
            projektekUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: projektId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // PROJEKTEK END
}
