/**
 cache API data from Transloc
 cache a map of stop_id's to names
 cache a map of route_id to route_names
 cache all active vehicles?
 cache all active routes?
 update cache every x seconds
 **/

const NodeCache = require( "node-cache" );

const log = console.log;
const CACHE_KEY = {
    route_id_to_name : "route_id_to_name",
    stop_id_to_name : "stop_id_to_name",
};

class Cache {

    constructor(checkperiod,deleteOnExpire,errorOnMissing,useClones = false) {
        this.myCache = new NodeCache({checkperiod,deleteOnExpire,errorOnMissing});
    }

    set(key,obj) {
            this.myCache.set(key, obj, (err, success) => {
                if (!err && success) {
                    log(success);
                } else {
                    log("error setting key");
                }
            });
        };

    // update cache every x minutes
    dispatchUpdate(){

    }

    // get item from cache
    get(key,callback){
        this.myCache.get(key, (err, value) => {
            if(!err) {
                if (value == undefined) {
                    log("value not found");
                } else {
                    callback(value);
                    return value;
                }
            }
        });
    };

    onSet(action) {
        let result = null;
        this.myCache.on(action, (key, value) => {
           try{
               log(JSON.parse(value));
               result = JSON.parse(value);
           } catch (JSONParseException){
              console.error(JSONParseException);
           }
        });
    }

    // clear out cache
    flush  (){
        this.myCache.flushAll();
        this.myCache.close();
    }
}

class BusCache extends Cache {
    constructor(args) {
        super(args);
    }
    getNameFromStopID(stopid){
        // TODO
        super.get(CACHE_KEY.stop_id_to_name,stopid);
    }

    getNameFromRouteID(routeid){
        // super.get(CACHE_KEY.route_id_to_name,routeid,());
    }
}


class MyRutgersCache extends Cache {
    constructor(args){
        super(args);
    }

    getPlaces(){

    }
}

// Cache object for Transloc data
const busCache = new Cache(1000,false,true);
// Cache object for MyRutgersData
const myRutgersCache = new Cache(1000,false,true);
module.exports = busCache;