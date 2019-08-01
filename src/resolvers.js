const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

const log = console.log;
// resolver functions for transloc graphql api. Returns an object {} with functions as properties
const resolvers = {
    arrivals: function(args,context){
    },
    routes: function(args, context){
        return getRoutes();
    },
    segments: function(args,context){

    },
    vehicles: function(args,context){

    },
    stops: function(args,context){

    },
};

function getRoutes(){
    const URL = config.API_URL + '/routes.json';
    axios.get(URL, {
        headers : config.HEADERS,
        params : {
        'agencies' : '1323',
        'geo_area'  : config.geo_area,
        }})
        .then((res) => {
            log(chalk.bgGreen.black('Success'));
            log(res['data']);
            return res['data'];
        })
        .catch((error) => {
                // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
                const pf = chalk.bgRed.black;
                log(pf("ERROR!!!!"));
                if (error.response) {
                    /*
                     * The request was made and the server responded with a
                     * status code that falls out of the range of 2xx
                     */
                    log(error.response.data);
                    log(error.response.status);
                    log(error.response.headers);
                } else if (error.request) {
                    /*
                     * The request was made but no response was received, `error.request`
                     * is an instance of XMLHttpRequest in the browser and an instance
                     * of http.ClientRequest in Node.js
                     */
                    log(error.request);
                } else {
                    // Something happened in setting up the request and triggered an Error
                    log('Error', error.message);
                }
                log(error.config);
            });
}

module.exports = resolvers;
