import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const penzugySzolgAdminUrl = location.origin + '/api/admin/penzugyszolg';

export default class Services {
    // PENZUGYI SZOLG START

    static listPenzugyiSzolgaltatasok = (fnDone) => {
        let result = Microservices.fetchApi(
            penzugySzolgAdminUrl,
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

    static getPenzugyiSzolgaltatas = (id, fnDone) => {
        let result = Microservices.fetchApi(
            penzugySzolgAdminUrl,
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

    static addPenzugyiSzolgaltatas = (data, fnDone) => {
        let result = Microservices.fetchApi(
            penzugySzolgAdminUrl,
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

    static editPenzugyiSzolgaltatas = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            penzugySzolgAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*     'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static deletePenzugyiSzolgaltatas = (id, fnDone) => {
        let result = Microservices.fetchApi(
            penzugySzolgAdminUrl,
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

    static deleteImage = (filename, penzugyiSzolgAdminId, fnDone) => {
        let result = Microservices.fetchApi(
            penzugySzolgAdminUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: penzugyiSzolgAdminId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // PENZUGYI SZOLG END
}
