const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

const log = console.log;
// resolver functions for transloc graphql api. Returns an object {} with functions as properties
const resolvers = {
    routes:  (args,context) => {
        return getRoutes().then((res) => {return res});
    },
    arrivals:  (args,context) => {
        return getArrivals().then((res) => {return res});
    },
    segments:  (args,context) => {
        return getSegments().then((res) => {return res});
    },
    vehicles:  (args,context) => {
        return getVehicles().then((res) => {return res});
    },
    stops:  (args,context) => {
        return getStops().then((res) => {return res});
    },
};
function queryAPI(URL){
    return axios.get(URL, {
        headers : config.HEADERS,
        params : {
            'agencies' : '1323',
            'geo_area'  : config.geo_area,
        }})
        .then((result) => {
            log(chalk.bgGreen.black('Success'));
            // un-nest data object.
            let res = result['data'];
            let data = (res['data'])['1323'];
            res['data'] = data;
            return res;
        })
        .catch((error) => {
            // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
            const pf = chalk.bgRed.black;
            log(pf("ERROR!!!!"));
            if (error.response) {
                log(error.response.data);
                log(error.response.status);
                log(error.response.headers);
            } else if (error.request) {
                log(error.request);
            } else {
                log('Error', error.message);
            }
            log(error.config);
        });
}

function getArrivals(){
    const URL = config.API_URL + '/arrivals.json'
    queryAPI(URL)
};

function getSegments(){
    const URL = config.API_URL + '/segments.json';
    return queryAPI(URL);
};

function getVehicles(){
    const URL = config.API_URL + '/vehicles.json';
    return queryAPI(URL);
};

function getStops(){
    const URL = config.API_URL + '/stops.json';
    return queryAPI(URL);
};

function getRoutes(){
    const URL = config.API_URL + '/routes.json';
    return queryAPI(URL);
}

module.exports = resolvers;
