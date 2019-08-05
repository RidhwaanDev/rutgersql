const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

const log = console.log;
// resolver functions for transloc graphql api. Each function returns a promise ( because axios.get in queryAPI returns a promise).
// We call then to get the returned data inside of the promise. idk if that make sense
const resolvers = {
    routes:    (args,context) => {
        return getRoutes().then((res) => {return res});
    },
    arrivals:  (args,context) => {
        return getArrivals(args).then((res) => {return res});
    },
    segments:  (args,context) => {
        return getSegments(args).then((res) => {return res});
    },
    vehicles:  (args,context) => {
        return getVehicles(args).then((res) => {return res});
    },
    stops:     (args,context) => {
        return getStops(args).then((res) => {return res});
    },
};

// all API request MUST go through here.
function queryAPI(URL, args, unnest = false){
    let my_params = {
        'agencies': '1323',
        'geo_area': config.geo_area,
    };
    // add all the args into my_params object. Could be a better way to do this.
    Object.keys(args).forEach((key,value) => {
        my_params[key] = args[key];
    });
    return axios.get(URL, {
        headers : config.HEADERS,
        params : my_params,
        })
        .then((result) => {
            log(chalk.green('Success'));
            log(chalk.red(JSON.stringify(my_params)));
            // Transloc sometimes returns "data : { 1323 : {actual data here }}" so we have to unwrap 1323 to get real data.
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
function getVehiclesByName(args){
    getVehicles(args).then((res) => {
    })
}
function getVehicles(args){
    log(chalk.green("getting vehicles"));
    const URL = config.API_URL + '/vehicles.json';
    const my_params  = {
        //  lmao this is insane but its 2018 ES6 syntax. See https://stackoverflow.com/questions/5409641/javascript-set-a-variable-if-undefined
        // if routes is undefined set key as null otherwise join it ( changes it from routes : [a,b,c] to routes : "a,b,c".
     routes : Object.is(args['routes'], undefined) ? null : args['routes'].join(',')
    };
    return queryAPI(URL,my_params,true);
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
