const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

const log = console.log;

/**
 * resolver functions for transloc graphql api.
 * These are basically the endpoints.
 */

const resolvers = {
    routes:    (args,context) => {
        return getRoutes();
    },
    arrivals:  (args,context) => {
        return getArrivals(args);
    },
    segments:  (args,context) => {
        return getSegments(args);
    },
    vehicles:  (args,context) => {
        return getVehicles(args);
    },
    stops:     (args,context) => {
        return getStops(args);
    },
    vehiclesByName : (args,context) => {
        return getVehiclesByName(args);
    },
};

// all API calls MUST go through here.
function queryAPI(URL, args, unnest = false){
    let my_params = {
        'agencies': '1323',
        'geo_area': config.geo_area,
    };
    // add args into my_params object. Could be a better way to do this.
    if(args != null || args != undefined)  {
        Object.keys(args).forEach((key,value) => {
            my_params[key] = args[key];
        });
    }
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
                // log(res);
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
    return queryAPI(URL).then((res) => {return res});
};

function getSegments(args){
    const URL = config.API_URL + '/segments.json';
    return queryAPI(URL).then((res) => {return res});
};

// pass in the routes name like 'A' or 'LX' and get all the associated vehicles
function getVehiclesByName(args){
    // first get routes
    const route_name = args['routeName'];
    const routes = getRoutes(null).then((response) =>
    {
        let res = response['data'];
        let map = {};
        // go through all the Routes and map route_id to long_name ("Route LX, Route B, on Transloc").
        res.forEach((it) => {map[it.route_id] = it.long_name});
        // Vehicles API and match route_id to long_name. If it matches the requested the route then push it to resultant array.
        let final_vehicles = [];
        const vehicles = getVehicles(config.route_id_test).then((response) => {
            let res = response['data'];
            res.forEach((it) => {
                if(map[it.route_id] === route_name) final_vehicles.push(it);
                else {log(chalk.bgRed("NO"))};
            });
            log(final_vehicles);
        });
    });

}

function getVehicles(args){
    log(chalk.green("getting vehicles"));
    const URL = config.API_URL + '/vehicles.json';
    const my_params  = {
        /**
         * lmao this is insane but its 2018 ES6 syntax. See https://stackoverflow.com/questions/5409641/javascript-set-a-variable-if-undefined
         * if routes is undefined set key as null otherwise join it ( changes it from routes : [a,b,c] to routes : "a,b,c". ( Array -> Single String basically)
         */
        routes : Object.is(args['routes'], undefined) ? null : args['routes'].join(',')
    };
    return queryAPI(URL,my_params,true).then((res) => {return res});
};

function getStops(args){
    log(chalk.cyan("getting stops"));
    const URL = config.API_URL + '/stops.json';
    return queryAPI(URL,args,true);

};

function getRoutes(args){
    log(chalk.magenta("getting routes"));
    const URL = config.API_URL + '/routes.json';
    return queryAPI(URL,args,true).then((res) => {return res});
}

module.exports = resolvers;
