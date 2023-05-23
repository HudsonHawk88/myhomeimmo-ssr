import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};

const ingatlanokUrl = location.origin + '/api/ingatlan';
const keresIngatlanokUrl = location.origin + '/ingatlan/keres';
const telepulesekUrl = location.origin + '/api/telepulesek';
const mailUrl = location.origin + '/api/contactmail';
const optionsUrl = location.origin + '/api/options';

export default class Services {
    // INGATLANOK START

    static listIngatlanok = (fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokUrl,
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

    static keresesIngatlanok = (kereso, fnDone) => {
        let result = Microservices.fetchApi(
            keresIngatlanokUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(kereso)
            },
            fnDone
        );

        return result;
    };

    static getIngatlan = (id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokUrl + `?id=${id}`,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    'Content-Type': 'application/json',
                    id: id
                },
                qs: { id: id }
                // query: id
            },
            fnDone
        );

        return result;
    };

    static addEIngatlan = (data, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(data)
            },
            fnDone
        );

        return result;
    };

    static editIngatlan = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: JSON.stringify(data)
            },
            fnDone
        );

        return result;
    };

    static deleteIngatlan = (id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokUrl,
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

    // INGATLANOK END

    // ORSZAGOK START

    /*   static listOrszagok = (fnDone) => {
            let result = Microservices.fetchApi(orszagokUrl, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                },
            },
                fnDone
            );

            return result;
        };

        static listOrszagokLike = (like, fnDone) => {
            let result = Microservices.fetchApi(orszagokUrl, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
                    like: like,
                },
            }, 
                fnDone
            );

            return result;
        }; */

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

    // EMAIL START

    static sendMail = (mailObj, fnDone) => {
        let result = Microservices.fetchApi(
            mailUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(mailObj)
            },
            fnDone
        );

        return result;
    };

    // EMAIL END
}
