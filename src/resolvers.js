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
        return getVehicles(args).then((res) => {return res});
    },
    stops:  (args,context) => {
        return getStops().then((res) => {return res});
    },
};

// TODO each method should provide the params object with the unnest flag.
function queryAPI(URL, args, unnest = false){
    return axios.get(URL, {
        headers : config.HEADERS,
        params : {
            'agencies' : '1323',
            'geo_area'  : config.geo_area,
       }})
        .then((result) => {
            log(chalk.bgGreen.black('Success'));
            // Transloc sometimes data : { 1323 : {actual data here }} so we have to get data.1323 to get actual result.
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

function getArrivals(args){
    const URL = config.API_URL + '/arrivals.json'
    return queryAPI(URL);
};

function getSegments(args){
    const URL = config.API_URL + '/segments.json';
    return queryAPI(URL);
};

function getVehicles(args){
    log(chalk.green("getting stops"));
    const URL = config.API_URL + '/vehicles.json';
    return queryAPI(URL,args,true);
};

function getStops(args){
    log(chalk.cyan("getting stops"));
    const URL = config.API_URL + '/stops.json';
    return queryAPI(URL,args);

};

function getRoutes(args){
    log(chalk.magenta("getting routes"));
    const URL = config.API_URL + '/routes.json';
    return queryAPI(URL,args,true);
}

module.exports = resolvers;
