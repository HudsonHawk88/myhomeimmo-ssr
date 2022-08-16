import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const ingatlanokUrl = location.origin + '/api/ingatlanok/aktiv';
const telepulesekUrl = location.origin + '/api/telepulesek';

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
  }; */

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
}
