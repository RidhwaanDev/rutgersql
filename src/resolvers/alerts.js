// get Transloc Alerts
const config = require('../config');
const network = require('../network');
const axios = require('axios');
const xml2js = require('xml2js');


const alerts = {
    alerts: () => {
        return getAlerts().then(res => { return res});
    }
}

async function getAlerts() {
    const data = await axios.get(config.TRANSLOC_ANNOUCEMENTS);
    const parser = xml2js.Parser();
    return new Promise((resolve, reject) => {
        parser.parseString(data['data'].toString(), (err, result) => {
            if (err) {
                reject(err);
            } else {
                const items = result.rss.channel[0].item;
                resolve(result.rss.channel[0].item);
            }
        })
    });
}

module.exports = alerts;
