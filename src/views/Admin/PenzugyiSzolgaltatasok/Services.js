import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const penzugySzolgAdminUrl = location.origin + '/api/admin/penzugyszolg';

export default class Services {
    // PENZUGYI SZOLG START

    static listPenzugyiSzolgaltatasok = () => {
        let result = Microservices.fetchApi(penzugySzolgAdminUrl, {
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

    static getPenzugyiSzolgaltatas = (id) => {
        let result = Microservices.fetchApi(penzugySzolgAdminUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                'Content-Type': 'application/json',
                id: id
            }
        });

        return result;
    };

    static addPenzugyiSzolgaltatas = (data) => {
        let result = Microservices.fetchApi(penzugySzolgAdminUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                /* 'Content-Type': 'application/json', */
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: data
        });
        return result;
    };

    static editPenzugyiSzolgaltatas = (data, id) => {
        let result = Microservices.fetchApi(penzugySzolgAdminUrl, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                /*     'Content-Type': 'application/json', */
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: id
            },
            body: data
        });
        return result;
    };

    static deletePenzugyiSzolgaltatas = (id) => {
        let result = Microservices.fetchApi(penzugySzolgAdminUrl, {
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

    static deleteImage = (filename, penzugyiSzolgAdminId) => {
        let result = Microservices.fetchApi(penzugySzolgAdminUrl + '/deleteimage', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                id: penzugyiSzolgAdminId
            },
            body: JSON.stringify({ filename: filename })
        });

        return result;
    };

    // PENZUGYI SZOLG END
}
