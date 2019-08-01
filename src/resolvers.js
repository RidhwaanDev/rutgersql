const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

const log = console.log;
// resolver functions for transloc graphql api. Returns an object {} with functions as properties
const resolvers = {
    getArrivals: function(args,context){
        log(chalk.blue(args));
        getRoutes();
    },
    getRoutes: function(args, context){

    },
    getSegments: function(args,context){

    },
    getVehicles: function(args,context){

    },
    getStops: function(args,context){

    },
};

function getRoutes(){
    const URL = config.API_URL + '/routes.json';
    axios.get(URL, {'headers': config.HEADERS})
        .then((res) => {
            log(chalk.bgGreen.black('Success'));
            return res['data'];
        })
        .catch((error) => {
            log(chalk.bgRed.black('Error'));
            log(chalk.yellow(JSON.stringify(error.type)));

        })
}

module.exports = resolvers;
