import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const ingatlanSzolgaltatasokUrl = location.origin + '/api/ingatlanszolg';

export default class Services {
    // INGATLAN SZOLGALTATASOK START

    static listIngatlanSzolgaltatasok = (fnDone) => {
        let result = Microservices.fetchApi(
            ingatlanSzolgaltatasokUrl,
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
    // INGATLAN SZOLGALTATASOK END
}
