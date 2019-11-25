// resolvers for directions and other
const {queryMapsAPI} = require('../network');
const {nearbyStops,stopsWithRoutes} = require('./complex');

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

const getDirections = args => {
    const user_pos = new Position(args.user_lat, args.user_lng);
    const dest_pos = new Position(args.dest_lat, args.dest_lng);
    // get directions from user_pos to closest stop
    return new Promise((resolve, reject) => {
        // user position, and final destination
        // const dest_pos = new Position(args.dest_lat, args.dest_lng);
        // get the closest stop to the user
        return distanceToNearbyStop(user_pos)
            .then(src => {
                // get the closes stop to the dest
                distanceToNearbyStop(dest_pos)
                    .then(dest => {
                        if(src != undefined && dest != undefined ){
                            resolve({src, dest});
                        }
                    });
            })
    }).then(stops_src_dest => {
        // routes coming to the stop
        return stopsWithRoutes(null,null)
            .then(stops => {
                // find the routes that go to dest from src  ( Buell to LSC e.g)
                const stop_with_vehicles_at_src = (stops.filter(it => it.stop_id === stops_src_dest.src.stop_id))[0];
                // vehciles at src and dest


                // all the vehicles coming into src stop
                const vsrc = stop_with_vehicles_at_src.vehicles;
                // final result of all vehicles that come into src stop and go to dest stop
                const vres = [];

                // prob better way to do this
                // for each vehicle "v" in vsrc, get arrival estimates. then for each estimate "est" get the stop id and see if it
                // matches the stop_id of dest.
                vsrc.forEach(v => {
                    v.arrival_estimates.forEach(est => {
                        if(est.stop_id === stops_src_dest.dest.stop_id){
                            vres.push(v);
                        }
                    });
                });

                vres.sort((a,b) => {
                    return a.arrival_estimates[0].arrival_at - b.arrival_estimates[0].arrival_at;
                });

                // return {stops_src_dest, vres};
                log(stops_src_dest);
                log(vres);
                return {
                    distance : stops_src_dest.src.distance,
                    duration : stops_src_dest.src.duration,
                    start_address : stops_src_dest.src.name,
                    end_address : stops_src_dest.dest.name,
                    vehicles : vres,
                };
            });

    })
};

//TODO need to return more than one stop in case that stop has no vehicles in which case we can discard that.
const distanceToNearbyStop = async user_pos => {
    const stops = await nearbyStops({lat : user_pos.lat, lng : user_pos.lng},null);
    //get directions from the user to the three stops, lets do one for now.
    stops.slice(0,4);
    const stop_pos = new Position(stops[0].location.lat,stops[0].location.lng);
    const res = await directions({user_pos : user_pos.toString(), nearest_stop_pos: stop_pos.toString()});
    // distance and duration but remove any text characters. So 3 miles -> 3 , 5 min -> 5
    if(res == null || res == undefined) {
        throw new Error("res is  null or res is undefined");
    }

    const distance = res.json.routes[0].legs[0].distance.text; // .replace(/\D/g,'');
    const duration = res.json.routes[0].legs[0].duration.text; //  .replace(/\D/g,'');
    const ret_test = {name : stops[0].name, stop_id : stops[0].stop_id, distance, duration};
};

// Directions from user_pos to the nearest stop

// distance matrix API
const distance = args => {

};

// directions API
const directions = async (args) => {
    // TODO change to promise
    const res = await queryMapsAPI("directions",args);
    return res;
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
