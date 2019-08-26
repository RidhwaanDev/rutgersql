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

module.exports.Cache = function Cache(checkPeriod, deleteOnExpire, errorOnMissing) {
    const myCache = new NodeCache();
    this.store = (key,obj) => {
        myCache.set(key, obj, (err, success) => {
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

    this.flush = () => {
        myCache.flushAll();
        myCache.close();
    }
};


