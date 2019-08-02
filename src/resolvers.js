const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

const log = console.log;
// resolver functions for transloc graphql api. Each function returns a promise ( because axios.get in queryAPI returns a promise).
// We call then to get the returned data inside of the promise. idk if that make sense
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
// TODO each method should provide the params object with the unnest flag.
function queryAPI(URL, unnest = true, params){
    return axios.get(URL, {
        headers : config.HEADERS,
        params : {
            'agencies' : '1323',
            'geo_area'  : config.geo_area,
        }})
        .then((result) => {
            log(chalk.bgGreen.black('Success'));
            // TODO explain what unnest is
            if(unnest){
                let res = result['data'];
                let data = (res['data'])['1323'];
                res['data'] = data;
                log(res);
                return res;
            }
            log(result['data']);
            return result['data'];
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
// you can convert these to arrow functions but no point in this case.

function getArrivals(){
    const URL = config.API_URL + '/arrivals.json'
    return queryAPI(URL);
};

function getSegments(){
    const URL = config.API_URL + '/segments.json';
    return queryAPI(URL);
};

function getVehicles(){
    log(chalk.green("getting stops"));
    const URL = config.API_URL + '/vehicles.json';
    const params = {routes : ""};
    return queryAPI(URL);
};

function getStops(){
    log(chalk.cyan("getting stops"));
    const URL = config.API_URL + '/stops.json';
    return queryAPI(URL,false);
};

function getRoutes(){
    log(chalk.magenta("getting routes"));
    const URL = config.API_URL + '/routes.json';
    return queryAPI(URL);
}

module.exports = resolvers;
