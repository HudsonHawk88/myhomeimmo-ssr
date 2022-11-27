import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const kapcsolatUrl = location.origin + '/api/kapcsolat';
const sendEmailUrl = location.origin + '/api/contactmail/sendfromcontact';
const rechaptchaUrl = location.origin + '/api/recaptcha';

export default class Services {
    // KAPCSOLAT START

    static listKapcsolat = () => {
        let result = Microservices.fetchApi(kapcsolatUrl, {
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

    static sendEmail = (emailObj) => {
        let result = Microservices.fetchApi(sendEmailUrl, {
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
    // KAPCSOLAT END

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
