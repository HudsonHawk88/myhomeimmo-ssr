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

    static listIngatlanok = () => {
        let result = Microservices.fetchApi(ingatlanokUrl, {
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

    static keresesIngatlanok = (kereso) => {
        let result = Microservices.fetchApi(keresIngatlanokUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: JSON.stringify(kereso)
        });

        return result;
    };

    static getIngatlan = (id) => {
        let result = Microservices.fetchApi(ingatlanUrl + `?id=${id}`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                'Content-Type': 'application/json',
                id: id
            },
            qs: { id: id }
        });

        return result;
    };

    static addEIngatlan = (data) => {
        let result = Microservices.fetchApi(ingatlanokUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: JSON.stringify(data)
        });
        return result;
    };

    static editIngatlan = (data, id) => {
        let result = Microservices.fetchApi(ingatlanokUrl, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: id
            },
            body: JSON.stringify(data)
        });
        return result;
    };

    static deleteIngatlan = (id) => {
        let result = Microservices.fetchApi(ingatlanokUrl, {
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

    // INGATLANOK END

    // ORSZAGOK START

    /*   static listOrszagok = () => {
    let result = Microservices.fetchApi(orszagokUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
    });

    return result;
  };

  static listOrszagokLike = (like) => {
    let result = Microservices.fetchApi(orszagokUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        like: like,
      },
    });

    return result;
  }; */

    // ORSZAGOK END

    // TELEP??L??SEK START

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

    // TELEP??L??SEK END

    // RECHAPTCHA START

    static checkRechaptcha = (token) => {
        let result = Microservices.fetchApi(rechaptchaUrl, {
            method: 'POST',
            mode: 'cors',
            // cache: "no-cache",
            headers: {
                response: token
            }
        });
        return result;
    };

    // RECHAPTCHA END

    // EMAIL START

    static sendErdeklodes = (emailObj) => {
        let result = Microservices.fetchApi(emailUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: JSON.stringify(emailObj)
        });

        return result;
    };

    // EMAIL END

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
