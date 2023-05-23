import fetch from 'isomorphic-fetch';
import { createNotification } from '../src/App';
let data;
let ok;
async function handleResponse(response, isFnDone) {
    if (isFnDone) {
        if (!ok && response.msg) {
            createNotification('error', response.msg);
        }
    }

    data = response;

    return data;
}

class Microservices {
    static fetchApi = async (url, requestOptions, fnDone) => {
        /* requestOptions.headers['withCredentials'] = true; */
        return await fetch(url, requestOptions)
            .then((u) => {
                ok = u.ok;
                return u.json();
            })
            .then((resp) => {
                handleResponse(resp, true);
                if (fnDone) {
                    fnDone(ok ? null : data, ok ? data : null);
                } else {
                    handleResponse(resp, false);
                }
            });
    };
}

export { Microservices };
