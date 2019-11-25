// base resolvers that match the API requests on openapi: https://rapidapi.com/transloc/api/openapi-1-2?7
const config = require('../config');
const chalk = require('chalk');
const {queryAPI,queryMapsAPI} = require('../network');
const log = console.log;

const base = {
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

};

const getVehicles = async () => {
    log(chalk.green("getting vehicles"));
    const URL = config.API_URL + '/vehicles.json';
    const my_params  = {
        // if routes is undefined set key as null otherwise join it ( changes it from routes : [a,b,c] to routes : "a,b,c". ( Array -> Single String basically)
        // Also this line might only be needed for Summer routes because the API behavior was different in Summer 2019. Will need to test.
        // routes : Object.is(args['routes'], undefined) ? null : args['routes'].join(',')
         geo_area : config.geo_area

    };
    return await queryAPI(URL,my_params,true);
};

const getStops = async args => {
    log(chalk.cyan("getting stops"));
    const URL = config.API_URL + '/stops.json';
    return await queryAPI(URL,args);
};

// Needs to be unnested.
const getRoutes = async args => {
    log(chalk.magenta("getting routes"));
    const URL = config.API_URL + '/routes.json';
    return await queryAPI(URL,args,true);
};

const getArrivals = async args => {
    const URL = config.API_URL + '/arrival-estimates.json';
    return await queryAPI(URL,args);
};

const getSegments = async args => {
    const URL = config.API_URL + '/segments.json';
    const res = await queryAPI(URL,args);
    let segments = [];
    let segment_obj = res['data'];
    Object.keys(segment_obj).forEach((key) => {
        segments.push(segment_obj[key]);
    });
    res['data'] = segments;
    return res;
};

module.exports = {
    baseResolvers: base,
    getStops,
    getSegments,
    getRoutes,
    getVehicles,
    getArrivals,
};
