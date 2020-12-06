import Axios from 'axios';
import qs from 'qs';
const axios = Axios.create();
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://www.tpss.com/';
axios.interceptors.request.use((config) => {

    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    if (config.method === 'get') {
        config.data = { params: config.data };
    }

    return config;
});
// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        // Do something with response data
        // let data = response.data;
        // response.data = response.data

        return response;
    },
    (error) => {
        // Do something with response error
        return Promise.reject(error);
    }
);

// if (process.env.NODE_ENV === "production") {
//     axios.defaults.baseURL = production_url;
// } else {
//     axios.defaults.baseURL = development_url;
// }
axios.defaults.baseURL = process.env.VUE_APP_URL;
export const request = axios;