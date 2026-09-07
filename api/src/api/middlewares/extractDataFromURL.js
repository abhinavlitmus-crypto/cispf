const http = require("http");
const axios = require('axios');
const Response = require("../../utilities/Response");
const HttpStatus = require("http-status-codes");
const _ = require("lodash");
const csv = require("csvtojson");
const request = require("request")
function extractDataFromUrl(req, res, next) {
    async function getDataFromURL() {
        console.log(req.body)
        const data = await axios.get(req.body.url);
        req.body.urlData = data.data;
        next();
    }
    getDataFromURL();
}

module.exports = {
    extractDataFromUrl
};
