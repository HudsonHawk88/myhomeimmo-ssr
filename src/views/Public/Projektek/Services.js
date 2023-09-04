import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const projektekUrl = location.origin + '/api/projektek';
const ingtlanokUrl = location.origin + '/api/ingatlan';
const optionsUrl = location.origin + '/api/options';

export default class Services {
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
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
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

    static getCurr = (currObj, fnDone) => {
        let result = Microservices.fetchApi(
            ingtlanokUrl + '/getdeviza',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(currObj)
            },
            fnDone
        );

        return result;
    };

    static convertCurr = (currObj, fnDone) => {
        let result = Microservices.fetchApi(
            ingtlanokUrl + '/changedeviza',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(currObj)
            },
            fnDone
        );

        return result;
    };

    // PROJEKTEK END

    // INGATLANOK START

    static getProjektIngatlanok = (ids, fnDone) => {
        let result = Microservices.fetchApi(
            ingtlanokUrl + '/ingatalnokbyids',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: ids })
            },
            fnDone
        );

        return result;
    };

    // INGATLANOK END

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
