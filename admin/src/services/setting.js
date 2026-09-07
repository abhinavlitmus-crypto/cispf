import axios from "../utils/axios";

export default class service {

    static baseURL = '';


    /**
     * Setting Services
     **/

    static detailSetting(data) {
        return axios.get(this.baseURL + "/settings/details/" + data.type);
    }
    static listSetting(data) {
        return axios.get(this.baseURL + "/settings/list", { params: data });
    }
    static saveSetting(data, query) {
        return axios.post(this.baseURL + "/settings/save", data, { params: query });
    }
    static deleteSetting(id) {
        return axios.post(this.baseURL + '/settings/delete', { ids: id });
    }

    /**
     * Contactus Services
     **/

    static detailContactus(data) {
        return axios.get(this.baseURL + "/contact-us/details/" + data.type);
    }
    static listContactus(data) {
        return axios.get(this.baseURL + "/contact-us/list", { params: data });
    }
    static saveContactus(data, query) {
        return axios.post(this.baseURL + "/contact-us/save", data, { params: query });
    }

    /**
     * Application Services
     **/

    static detailApplication(data) {
        return axios.get(this.baseURL + "/application/details/" + data.type);
    }
    static listApplication(data) {
        return axios.get(this.baseURL + "/application/list", { params: data });
    }
    static saveApplication(data, query) {
        return axios.post(this.baseURL + "/application/save", data, { params: query });
    }
}