// network requests using axios. All API calls / DynamoDB queries are done through here.
const axios = require('axios');
const config = require('./config');
const chalk = require('chalk'); // fun colors for the terminal.

const log = console.log;
// When using axios to call the segments API the result is sorted based on the keys of each segment since each key is a number.
// This is bad because when we draw the segments we want the segments to be in the original order so it can be drawn properly.
// Here we get the raw string from the segments API, replace each key with a some "key" and a number, then call JSON.parse, then return it
const cleanSegmentsResult = result => {
    const b = new Buffer(result.data,'binary');
    const str = b.toString();
    const regexp = /"(\d{9})"/;

    // replace each 9 digit number (the keys to each segment) with a random key. 
    // This prevents JSON.parse from sorting the keys and messing with the segments

    // count the keys in the sorted/messed up object
    const result_sorted = JSON.parse(str);
    log(result_sorted);
    let i = 0;
    Object.keys(result_sorted['data']).forEach(key => {
       i++;
    });

    // do regex replace with "key" + key_cnt on each instance of the key
    log(`There are ${i} amount of keys in sorted segments object`);
    let key_cnt = 0;
    let prev = str;
    let running_str = '';
    while(prev.match(regexp) != null){
        running_str = prev.replace(regexp,`\"segment${key_cnt}\"`);
        prev = running_str;
        key_cnt++;
    }
    // compare keys in the unsorted/cleaned object
    let j = 0;
    const final_segments = JSON.parse(running_str);
    Object.keys(final_segments).forEach(key => {
        j++;
    });

    log(`There are ${i} amount of keys in cleaned segments object`);

    log(final_segments);
    return final_segments;
};

// query Transloc API
function queryAPI(URL, args, unnest = false){
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
    if(segments){
        log('adding semgment confit');
        axios_config.responseType = 'arraybuffer';
        axios_config.transformResponse = undefined;
    }
    return axios.get(URL,axios_config)
        .then((result) => {
            log(chalk.green('Success'));
            if(segments){
                return cleanSegmentsResult(result);
            }
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
// query google maps API
function queryMapsAPI(){

}

function queryRutgersPlacesAPI(){

}

module.exports = queryAPI;
