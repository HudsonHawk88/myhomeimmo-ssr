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

    static listIngatlanok = (fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl,
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

    static getIngatlan = (id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl,
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

    static addIngatlan = (data, fnDone) => {
        // console.log(data);
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    // "Content-Type": "multipart/form-data",
                    // "Content-type": "application/x-www-form-urlencoded",
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: data
            },
            fnDone
        );
        return result;
    };

    static editIngatlan = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    // "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: data
            },
            fnDone
        );
        return result;
    };

    static deleteIngatlan = (id, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl,
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

    static jovahagyasraKuldes = (ingatlanId, isAktiv, publikusChange, isNew, regiIngatlan, modositoObj, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanJovahagyasAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ingatlanId: ingatlanId,
                    isAktiv: isAktiv,
                    publikusChange: publikusChange,
                    isNew: isNew
                },
                body: JSON.stringify({ adatok: { modositoObj, regiIngatlan } })
            },
            fnDone
        );
        return result;
    };

    static infoPDF = (ingatlanId, fnDone) => {
        let result = Microservices.fetchApi(
            infoPDFUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    'Content-Type': 'application/json',
                    ingatlanId: ingatlanId
                }
            },
            fnDone
        );
        return result;
    };

    // INGATLANOK END

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

    static generateXml = (fnDone) => {
        let result = Microservices.fetchApi(
            generateXmlUrl,
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

    static deleteFile = (filename, dir, ingatlanId, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl + '/deletefile',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: ingatlanId,
                    dir: dir
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    static deleteImage = (filename, ingatlanId, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanokAdminUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: ingatlanId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // TELEPÜLÉSEK END

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
