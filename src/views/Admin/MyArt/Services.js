import { Microservices } from '../../../../shared/MicroServices';
const location = typeof window !== 'undefined' ? window.location : {};
const myArtAltalanosAdminUrl = location.origin + '/api/admin/myart/altalanos';

const myArtGaleriakAdminUrl = location.origin + '/api/admin/myart/galeriak';

export default class Services {
    // MYARTALTALANOS START

    static listAltalanos = (fnDone) => {
        let result = Microservices.fetchApi(
            myArtAltalanosAdminUrl,
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

    static getAltalanos = (id, fnDone) => {
        let result = Microservices.fetchApi(
            myArtAltalanosAdminUrl,
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

    static addAltalanos = (data, fnDone) => {
        let result = Microservices.fetchApi(
            myArtAltalanosAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: JSON.stringify(data)
            },
            fnDone
        );

        return result;
    };

    static editAltalanos = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            myArtAltalanosAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: JSON.stringify(data)
            },
            fnDone
        );

        return result;
    };

    static deleteAltalanos = (id, fnDone) => {
        let result = Microservices.fetchApi(
            myArtAltalanosAdminUrl,
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

    // MYARTALTALANOS END

    // MYARTGALERIAK START

    static listGaleriak = (fnDone) => {
        let result = Microservices.fetchApi(
            myArtGaleriakAdminUrl,
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

    static getGaleria = (id, fnDone) => {
        let result = Microservices.fetchApi(
            myArtGaleriakAdminUrl,
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

    static addGaleria = (data, fnDone) => {
        let result = Microservices.fetchApi(
            myArtGaleriakAdminUrl,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*  'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static editGaleria = (data, id, fnDone) => {
        let result = Microservices.fetchApi(
            myArtGaleriakAdminUrl,
            {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    /*   'Content-Type': 'application/json', */
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: id
                },
                body: data
            },
            fnDone
        );

        return result;
    };

    static deleteGaleria = (id, fnDone) => {
        let result = Microservices.fetchApi(
            myArtGaleriakAdminUrl,
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

    static deleteImage = (filename, galeriaImgId, fnDone) => {
        let result = Microservices.fetchApi(
            myArtGaleriakAdminUrl + '/deleteimage',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://192.168.11.64:3000',
                    id: galeriaImgId
                },
                body: JSON.stringify({ filename: filename })
            },
            fnDone
        );

        return result;
    };

    // MYARTGALERIAK END
}
