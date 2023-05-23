import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const myArtUrl = location.origin + '/api/myart';

export default class Services {
    // MYART START

    static listAltalanos = (fnDone) => {
        let result = Microservices.fetchApi(
            myArtUrl + '/altalanos',
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

    static listGaleriak = (fnDone) => {
        let result = Microservices.fetchApi(
            myArtUrl + '/galeriak',
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

    // MYART END
}
