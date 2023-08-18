import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const ingatlanokUrl = location.origin + '/api/ingatlan/aktiv';
const ingatlanUrl = location.origin + '/api/ingatlan';
const keresIngatlanokUrl = location.origin + '/api/ingatlan/keres';
const telepulesekUrl = location.origin + '/api/telepulesek';
const emailUrl = location.origin + '/api/contactmail/ingatlanerd';
const rechaptchaUrl = location.origin + '/api/recaptcha';
/* const rechaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify?'; */
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

    static convertCurr = (currObj, fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanUrl + '/changedeviza',
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
            ingatlanUrl + `?id=${id}`,
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

    // RECHAPTCHA START

    static checkRechaptcha = (token, fnDone) => {
        let result = Microservices.fetchApi(
            rechaptchaUrl,
            {
                method: 'POST',
                mode: 'cors',
                // cache: "no-cache",
                headers: {
                    response: token
                }
            },
            fnDone
        );

        return result;
    };

    // RECHAPTCHA END

    // EMAIL START

    static sendErdeklodes = (emailObj, fnDone) => {
        let result = Microservices.fetchApi(
            emailUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(emailObj)
            },
            fnDone
        );

        return result;
    };

    // EMAIL END

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
