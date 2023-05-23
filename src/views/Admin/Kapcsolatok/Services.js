import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const kapcsolatAdminUrl = location.origin + '/api/admin/kapcsolat';

export default class Services {
    // KAPCSOLAT START

    static listKapcsolatok = (fnDone) => {
        let result = Microservices.fetchApi(
            kapcsolatAdminUrl,
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

    static getKapcsolat = (id, fnDone) => {
        let result = Microservices.fetchApi(
            kapcsolatAdminUrl,
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

    static addKapcsolat = (data, fnDone) => {
        let result = Microservices.fetchApi(
            kapcsolatAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /* 'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static editKapcsolat = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            kapcsolatAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*  'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static deleteKapcsolat = (id, fnDone) => {
        let result = Microservices.fetchApi(
            kapcsolatAdminUrl,
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

    static deleteImage = (filename, kapcsolatId, fnDone) => {
        let result = Microservices.fetchApi(
            kapcsolatAdminUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: kapcsolatId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // KAPCSOLAT END
}
