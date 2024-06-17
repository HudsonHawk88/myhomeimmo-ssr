import fetch from 'isomorphic-fetch';
import { createNotification } from '../src/App';
let data;
let ok = false;
function handleResponse(response, isFnDone) {
    if (isFnDone) {
        if (!ok && response.msg) {
            createNotification('error', response.msg);
        }
        data = response;
    } else {
        if (!response.ok) {
            data = response
                .json()
                .catch(() => {
                    // Couldn't parse the JSON
                    throw new Error(response.status);
                })
                .then(({ message }) => {
                    // Got valid JSON with error response, use it
                    throw new Error(message || response.status);
                });
        }
        // Successful response, parse the JSON and return the data
        data = response.json();
    }

    return data;
}

class Microservices {
    static fetchApi = async (url, requestOptions, fnDone) => {
        /* requestOptions.headers['withCredentials'] = true; */
        if (fnDone) {
            return await fetch(url, requestOptions)
                .then((u) => {
                    ok = u.ok;
                    return u.json();
                })
                .then((resp) => {
                    // handleResponse(resp, true);
                    if (fnDone) {
                        if (ok) {
                            if (resp.data) {
                                fnDone(null, resp.data);
                            } else {
                                fnDone(null, resp);
                            }
                        } else {
                            fnDone(resp.err, null);
                        }
                    } else {
                        handleResponse(resp, false);
                    }
                })
                .catch((error) => fnDone(error, null));
        } else {
            return await fetch(url, requestOptions).then(handleResponse);
        }
    };
}

export { Microservices };
