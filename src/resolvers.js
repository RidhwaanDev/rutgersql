const axios = require('axios');
const config = require('./config');
const chalk = require('chalk');

// resolver functions for transloc graphql api. Returns an object {} with functions as properties
export default {
    getArrivals: function(args,context){
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
}

function getRoutes(){
    const URL = config.API_URL + '/routes.json';
    axios.get(URL, {'headers': config.HEADERS})
        .then((res) => {
            chalk.green('Success')
            return res['data'];
        })
        .catch((error) => {
            chalk.red('Error');
            chalk.yellow(JSON.stringify(error.type));
        })
}



