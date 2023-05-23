import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const rolunkUrl = location.origin + '/api/rolunk';

export default class Services {
    // ROLUNK START

    static listRolunk = (fnDone) => {
        let result = Microservices.fetchApi(
            rolunkUrl,
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
    // ROLUNK END
}
