// resolvers for directions and other
const {queryMapsAPI} = require('../network');
const {nearbyStops,stopsWithRoutes} = require('./complex')
const globalCache = require('../structures/cache');

const Position = require('../structures/position');
// resolvers for Google Maps API
const Directions = {
    distance      : args => {},
    geocode       : args => {},
    directions : args => {
        return getDirections(args);
    },
};

const log = console.log;
/**
 input: lat,lng of user => (pos), String of destination => (dest) => geocode(dest) => lat,lng dest

 procedure:
 find closest stop to (dest) => STOP_B
 find closest stop to (user) => STOP_A
 find all route arrivals for STOP_A that go to STOP_B => [arrivals_A_to_B]
 **/

const getDirections = (args) => {
    const user_pos = new Position(args.user_lat, args.user_lng);
    const dest_pos = new Position(args.dest_lat, args.dest_lng);

    // get directions from user_pos to closest stop
    return new Promise((resolve, reject) => {
        // user position, and final destination
        // const dest_pos = new Position(args.dest_lat, args.dest_lng);

        // get the closest stop to the user
        return distanceToNearbyStop(user_pos)
            .then(user_res => {
                // get the closes stop to the dest
                distanceToNearbyStop(dest_pos)
                    .then(dest_res => {
                        if(user_res != undefined && dest_res != undefined ){
                            resolve({user_res, dest_res});
                        }
                    });
            })

    }).then( stops_src_dest => {
        // routes coming to the stop
        stopsWithRoutes(null,null)
            .then(stops => {
                // get the routes that are coming to the user_res stop from stops_src_dest
                const stop_with_vehicles = (stops.filter(it => it.stop_id === stops_src_dest.user_res.stop_id))[0];
                globalCache.get("route_id_to_name", map => {
                    if(!map){
                        log("route_id_to_name is unintialized");
                    }
                    stop_with_vehicles.vehicles.forEach(it => {it['name'] = map[it['route_id']]});
                    log(stop_with_vehicles);
                });

            })
    })
};

const distanceToNearbyStop = (user_pos) => {
    return new Promise((resolve,reject) => {
        nearbyStops({lat : user_pos.lat, lng : user_pos.lng},null)
            .then(stops => {
                // get directions from the user to the three stops, lets do one for now.
                stops.slice(0,4);
                const stop_pos = new Position(stops[0].location.lat,stops[0].location.lng);
                return directions({user_pos : user_pos.toString(), nearest_stop_pos: stop_pos.toString()},(res) => {
                    // distance and duration but remove any text characters. So 3 miles -> 3 , 5 min -> 5
                    if(res == null || res == undefined){
                        reject(res);
                    } else {
                        const distance = res.json.routes[0].legs[0].distance.text; // .replace(/\D/g,'');
                        const duration = res.json.routes[0].legs[0].duration.text; //  .replace(/\D/g,'');
                        const ret_test = {name : stops[0].name, stop_id : stops[0].stop_id, distance, duration};
                        resolve(ret_test);
                    }

                })
            });
    });
};

// Directions from user_pos to the nearest stop

// distance matrix API
const distance = args => {

};
// directions API
const directions = (args, callback) => {
    // TODO change to promise
    return queryMapsAPI("directions",args, function(res){
        callback(res);
    });
};
// geocode API
const geocode = args => {
    const api_name = 'geocode';
    // queryMapsAPI('geocode',)
};

// travel time from one stop to another stop via bus
const travelTime = args => {

};

module.exports = Directions;
