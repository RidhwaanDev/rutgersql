const axios = require('axios');
const gmap = require('@google/maps');
const config = require('./config');
const chalk = require('chalk'); // fun colors for the terminal.

const log = console.log;
const error = console.error;

const get = async url => {
  axios.getUri(url)
      .then(res => {
        log(res);
      });
};

// query Transloc asAPI
const queryAPI = async (URL, args, unnest = false) => {
    let my_params = {
        'agencies': '1323',
    };

    let segments = false;

    if (!URL.includes("segments")) {
        my_params['geo_area'] = config.geo_area;
    } else {
        segments = true;
        delete my_params['geo_area'];
        my_params['callback'] = 'call';
    }
    // put args into my_params object
    if (args) {
        Object.keys(args).forEach((key, value) => {
            my_params[key] = args[key];
        });
    }
    // intercept the request before it is sent. useful for debugging
    axios.interceptors.request.use(config => {
        const final_request_url = axios.getUri(config);
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // configure our network request
    const axios_config = {};
    axios_config.headers = config.HEADERS;
    axios_config.params = my_params;
    if (segments) {
        axios_config.responseType = 'arraybuffer';
        axios_config.transformResponse = undefined;
    }

    try {
        const result = await axios.get(URL, axios_config);
        // Some endpoints on Transloc return "data : { 1323 : {actual data here}}" so we have to unwrap 1323 to get real data.
        if (unnest) {
            let res = result['data'];
            let data = (res['data'])['1323'];
            res['data'] = data;
            return res;
        }
        return result['data'];
    } catch (error) {
        log(chalk.red('Error'));
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
    }
};
// query google maps API using node.js client library
const queryMapsAPI = async (api_name,args) => {
    const gmapclient = gmap.createClient({
        key: config.GMAP_API_KEY,
    });

    switch(api_name){
        case "directions" :
            await gmapclient.directions({
                origin : args.user_pos,
                destination : args.nearest_stop_pos,
                mode   : "walking",
            } , (err, res) => {
                if(res.status !== 200 || res.json.status !== 'OK') {
                    error(JSON.stringify(res, null, 2));
                } else {
                    return res;
                 }
                },
            );
            break;
        case "distance":
            break;
        case "geocode":
            break;
    }
};

module.exports = {
    queryAPI,
    queryMapsAPI,
    get,
};
