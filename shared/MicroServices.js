import fetch from 'isomorphic-fetch';
function handleResponse(response) {
    if (!response.ok) {
        return response
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
    return response.json();
    // let data = response.json().then((adat) => {
    //   return adat;
    // });
    // return data;
}

class Microservices {
    static fetchApi = async (url, requestOptions) => {
        /* requestOptions.headers['withCredentials'] = true; */
        return await fetch(url, requestOptions).then(handleResponse);
    };
}

export { Microservices };
