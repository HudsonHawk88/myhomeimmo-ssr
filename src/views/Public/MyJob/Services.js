import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const applyJobUrl = location.origin + '/api/contactmail/jobApply';
const rechaptchaUrl = location.origin + '/api/recaptcha';

export default class Services {
    // INGATLAN SZOLGALTATASOK START

    static sendJobApply = (emailObj) => {
        let result = Microservices.fetchApi(applyJobUrl, {
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
    // INGATLAN SZOLGALTATASOK END

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
}
