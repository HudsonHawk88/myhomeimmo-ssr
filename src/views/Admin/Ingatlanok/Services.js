import { Microservices } from '../../../../shared/MicroServices';
const location = __isBrowser__ ? window.location : {};
const ingatlanokUrl = location.origin + '/api/ingatlan';
const ingatlanokAdminUrl = location.origin + '/api/admin/ingatlanok';
const ingatlanJovahagyasAdminUrl = location.origin + '/api/admin/ingatlanok/jovahagyas';
const infoPDFUrl = location.origin + '/api/admin/ingatlanok/infoPDF';
const orszagokUrl = location.origin + '/api/orszagok';
const telepulesekUrl = location.origin + '/api/telepulesek';
const generateXmlUrl = location.origin + '/api/ingatlan/ingatlanokapi';
const optionsUrl = location.origin + '/api/options';

export default class Services {
    // INGATLANOK START

    static listIngatlanok = () => {
        let result = Microservices.fetchApi(ingatlanokAdminUrl, {
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

    static getIngatlan = (id) => {
        let result = Microservices.fetchApi(ingatlanokAdminUrl, {
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

    static addIngatlan = (data) => {
        // console.log(data);
        let result = Microservices.fetchApi(ingatlanokAdminUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                // "Content-Type": "multipart/form-data",
                // "Content-type": "application/x-www-form-urlencoded",
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: data
        });
        return result;
    };

    static editIngatlan = (data, id) => {
        let result = Microservices.fetchApi(ingatlanokAdminUrl, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                // "Content-Type": "application/json",
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: id
            },
            body: data
        });
        return result;
    };

    static deleteIngatlan = (id) => {
        let result = Microservices.fetchApi(ingatlanokAdminUrl, {
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

    static jovahagyasraKuldes = (ingatlanId) => {
        let result = Microservices.fetchApi(ingatlanJovahagyasAdminUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                ingatlanId: ingatlanId
            }
        });
        return result;
    };

    static printPDF = (ingatlanId) => {
        let result = Microservices.fetchApi(infoPDFUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
              /*   'Content-Type': 'application/pdf', */
                ingatlanId: ingatlanId
            }
        });
        return result;
    }

    // INGATLANOK END

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

    static generateXml = () => {
        let result = Microservices.fetchApi(generateXmlUrl, {
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

    static deleteImage = (filename, ingatlanId) => {
        let result = Microservices.fetchApi(ingatlanokAdminUrl + '/deleteimage', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: ingatlanId
            },
            body: JSON.stringify({ filename: filename })
        });

        return result;
    };

    // TELEPÜLÉSEK END

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
