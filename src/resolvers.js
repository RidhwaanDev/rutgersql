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
       return getRoutes(args);
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
    segmentsByName : (args,context) => {
        return getSegmentsByName(args);
    },
};

// base API query. All API requests go through here.
function queryAPI(URL, args, unnest = false){
    let my_params = {
        'agencies': '1323',
        'geo_area': config.geo_area,
    };

    // add args into my_params object
    if(args != undefined || args != null){
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
            // Transloc sometimes returns "data : { 1323 : {actual data here }}" so we have to unwrap 1323 to get real data.
            if(unnest){
                let res = result['data'];
                let data = (res['data'])['1323'];
                res['data'] = data;
                // log(res);
                return res;
            }
           // log(result['data']);
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
    const URL = config.API_URL + '/arrival-estimates.json'
    const my_params = {
        routes : Object.is(args['routes'], undefined) ? null : args['routes'].join(','),
        stops : Object.is(args['stops'], undefined) ? null : args['stops'].join(','),
    };
    return queryAPI(URL,my_params).then((res) => {return res});
};

// takes the route name like 'A' or 'LX' and gets the respective segments.
function getSegmentsByName(args){
    // get route_name from args
    const route_name = args['routeName'];
    log(route_name);
    const result = getRoutes(null)
        .then((response) => {
            log(JSON.stringify(response));
            const res = response['data'];
            log(res);
            const map = {};
            res.forEach((it) => {map[it.long_name] = it.route_id});
            const args = {routeName : map[route_name]};
            return getSegments(map[route_name]);
        });

    return result.then((vehicles_list) => {return vehicles_list});
}

function getSegments(args){
    const URL = config.API_URL + '/segments.json';
     return queryAPI(URL,args).then((res) => {
         let segments = [];
         let segment_obj = res['data'];
         Object.keys(segment_obj).forEach((key) => {
             segments.push(segment_obj[key]);
         });
         res['data'] = segments;
         return res;
    });
};

// takes the route name like 'A' or 'LX' and gets all the associated vehicles.
function getVehiclesByName(args){
    // get route_name from args
    const route_name = args['routeName'];
    const result = getRoutes(null)
        .then((response) => {
            // get all the routes and map the route id with its name. For example : ( "4040102" : "Route A )
            const res = response['data'];
            const map = {};
            res.forEach((it) => {map[it.route_id] = it.long_name});
            // get all the vehicles and filter the ones where the route_id in map returns the route name that we want.
            return getVehicles(config.route_id_test)
                .then((response) => {
                    const res = response['data'];
                    return res.filter((it) => map[it.route_id] === route_name);
                });
        });

    return result.then((vehicles_list) => {return vehicles_list});
}

function getVehicles(args){
    log(chalk.green("getting vehicles"));
    const URL = config.API_URL + '/vehicles.json';
    const my_params  = {
        // if routes is undefined set key as null otherwise join it ( changes it from routes : [a,b,c] to routes : "a,b,c". ( Array -> Single String basically)
        routes : Object.is(args['routes'], undefined) ? null : args['routes'].join(',')
    };
    return queryAPI(URL,my_params,true).then((res) => {return res});
};

function getStops(args){
    log(chalk.cyan("getting stops"));
    const URL = config.API_URL + '/stops.json';
    return queryAPI(URL,args);

};

function getRoutes(args){
    log(chalk.magenta("getting routes"));
    const URL = config.API_URL + '/routes.json';
    return queryAPI(URL,args,true).then((res) => {return res});
}

module.exports = resolvers;
