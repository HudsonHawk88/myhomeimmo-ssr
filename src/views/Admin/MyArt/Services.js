import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const myArtAltalanosAdminUrl = location.origin + '/api/admin/myart/altalanos';

const myArtGaleriakAdminUrl = location.origin + '/api/admin/myart/galeriak';

export default class Services {
    // MYARTALTALANOS START

    static listAltalanos = () => {
        let result = Microservices.fetchApi(myArtAltalanosAdminUrl, {
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

    static getAltalanos = (id) => {
        let result = Microservices.fetchApi(myArtAltalanosAdminUrl, {
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

    static addAltalanos = (data) => {
        let result = Microservices.fetchApi(myArtAltalanosAdminUrl, {
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

    static editAltalanos = (data, id) => {
        let result = Microservices.fetchApi(myArtAltalanosAdminUrl, {
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

    static deleteAltalanos = (id) => {
        let result = Microservices.fetchApi(myArtAltalanosAdminUrl, {
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

    // MYARTALTALANOS END

    // MYARTGALERIAK START

    static listGaleriak = () => {
        let result = Microservices.fetchApi(myArtGaleriakAdminUrl, {
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

    static getGaleria = (id) => {
        let result = Microservices.fetchApi(myArtGaleriakAdminUrl, {
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

    static addGaleria = (data) => {
        let result = Microservices.fetchApi(myArtGaleriakAdminUrl, {
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

    static editGaleria = (data, id) => {
        let result = Microservices.fetchApi(myArtGaleriakAdminUrl, {
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

    static deleteGaleria = (id) => {
        let result = Microservices.fetchApi(myArtGaleriakAdminUrl, {
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

    // MYARTGALERIAK END
}
