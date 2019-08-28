// network requests using axios. All API calls / DynamoDB queries are done through here.
const axios = require('axios');
const https = require('https');
const request = require('request');
const config = require('./config');
const chalk = require('chalk'); // fun colors for the terminal.

const log = console.log;

// query Amazon DB
const callSegments = () => {
    request('https://transloc-api-1-2.p.rapidapi.com/segments.json?agencies=1323&callback=call&routes=4012630', {
        headers : {
            'X-RapidAPI-Host': 'transloc-api-1-2.p.rapidapi.com',
            'X-RapidAPI-Key':'hHcLr1qWHDmshwibREtIrhryL9bcp1Fw9AQjsnCiZyEzRrJKOS', // prob should do something abt this
        }
    },(err,res,body) => {
        if(err){return log(err)}
        log(body);
    })
};

// query Transloc API
function queryAPI(URL, args, unnest = false){
    callSegments();
    let my_params = {
        'agencies': '1323',
    };
    let segments = false;
    // segments endpoint does not work with geo_area.
    //TODO geoarea is not the problem
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

    // configure our network request
    const axios_config = {};
    axios_config.headers = config.HEADERS;
    axios_config.params = my_params;
    // if(segments){
    //     log('adding semgment confit');
    //     axios_config.responseType = 'arraybuffer';
    //     axios_config.transformResponse = undefined;
    // }
    return axios.get(URL,axios_config)
        .then((result) => {
            log(chalk.green('Success'));
            // if(segments){
            //     const b = new Buffer(result.data,'binary');
            //     const str = b.toString();
            //     const js = JSON.parse(JSON.stringify(str));
            //     log(js);
            // }
            // Transloc sometimes returns "data : { 1323 : {actual data here }}" so we have to unwrap 1323 to get real data.
            if(unnest){
                let res = result['data'];
                let data = (res['data'])['1323'];
                res['data'] = data;
                return res;
            }
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
