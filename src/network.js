// network requests using axios. All API calls / resolvers go through these
const axios = require('axios');
const config = require('./config');
const chalk = require('chalk'); // fun colors for the terminal.

const log = console.log;


function queryAPI(URL, args, unnest = false){
    let my_params = {
        'agencies': '1323',
        'geo_area': config.geo_area,
    };

    // put args into my_params object
    if(args != undefined || args != null){
        Object.keys(args).forEach((key,value) => {
            my_params[key] = args[key];
        });
    }
    log(my_params);
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

module.exports = queryAPI;



