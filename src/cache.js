/**
 cache API data from Transloc
 cache a map of stop_id's to names
 cache a map of route_id to route_names
 cache all active vehicles
 cache all active routes
 update cache every x seconds
 **/

const NodeCache = require( "node-cache" );

const log = console.log;

function Cache(checkPeriod, deleteOnExpire, errorOnMissing) {
    const myCache = new NodeCache();
    this.store = (obj) => {
        myCache.set("myKey", obj, (err, success) => {
            if (!err && success) {
                log(success);
            }
        });
    };

    this.get = (key) => {
        myCache.get(key, (err, value) => {
            if (err) {
                return;
            }
            if (value === undefined) {
                log("Not found")
            } else {
            }
        });
    };
}
module.exports = Cache;



