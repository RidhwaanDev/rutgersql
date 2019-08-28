// network requests using axios. All API calls / DynamoDB queries are done through here.
const axios = require('axios');
const config = require('./config');
const chalk = require('chalk'); // fun colors for the terminal.

const log = console.log;

// query Amazon DB
const queryDB = () => {

};

// query Transloc API
function queryAPI(URL, args, unnest = false){
    let my_params = {
        'agencies': '1323',
    };
    let segments = false;
    if(!URL.includes("segments")){
        my_params['geo_area'] = config.geo_area;
    } else {
        segments = true;
        delete my_params['geo_area'];
        my_params['callback'] = 'call';
    }
    // put args into my_params object
    if(args != undefined || args != null){
        Object.keys(args).forEach((key,value) => {
            my_params[key] = args[key];
        });
    }
    // intercept the request before it is sent. useful for debugging
    axios.interceptors.request.use(config =>{
        const final_request_url = axios.getUri(config);
        return config;
    }, error => {
        return Promise.reject(error);
    });

    return axios.get(URL, {
        headers : config.HEADERS,
        responseType : 'arraybuffer',
        transformResponse : undefined,
        params : my_params,
    })
        .then((result) => {
            log(chalk.green('Success'));
            let b = new Buffer(result.data,'binary');
            log(b.toString());
            // Transloc sometimes returns "data : { 1323 : {actual data here }}" so we have to unwrap 1323 to get real data.
            if(unnest){
                let res = result['data'];
                let data = (res['data'])['1323'];
                res['data'] = data;
                //log(res);
                return res;
            }
            // log(result['data']);
            return result['data'];
        })
        .catch((error) => {
            // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
            log(chalk.red('Error'));
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
