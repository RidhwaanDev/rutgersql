// resolvers for directions and other
const {queryMapsAPI} = require('../network');
const {nearbyStops, stopsWithRoutes} = require('./complex').complexResolvers;

// TODO simplify Position object
const Position = require('../structures/position');

const Directions = {
    distance      : args => {},
    geocode       : args => {},
    directions : args => {
        return getDirections(args);
    },
};

const log = console.log;



// return segments of a route only from srcpos to destpos
const segmentsAB = async (srcpos, destpos ) => {

};

const getDirections = async args => {
    // user position, and final destination pos
    const user_pos = new Position(args.user_lat, args.user_lng);
    const dest_pos = new Position(args.dest_lat, args.dest_lng);
    // get the closest stop to the user
    const src = await distanceToNearbyStop(user_pos);
    // get the closest stop to the dest
    const dest = await distanceToNearbyStop(dest_pos);

    if (!src || !dest) {
        throw new Error("could not get src and dst")
    }

    // combine into one object
    const stops_src_dest = {src, dest};
    // routes coming to the stop
    const stops = await stopsWithRoutes(null, null);
    // find the routes that go to dest from src  (Buell to LSC e.g)
    const stop_with_vehicles_at_src = (stops.filter(it => it.stop_id === stops_src_dest.src.stop_id))[0];

    // all the vehicles coming into src stop
    const vsrc = stop_with_vehicles_at_src.vehicles;
    // final result of all vehicles that come into src stop and go to dest stop
    const vres = [];

    // prob better way to do this
    // for each vehicle "v" in vsrc, get arrival estimates. then for each estimate "est" get the stop id and see if it
    // matches the stop_id of dest.
    vsrc.forEach(v => {
        v.arrival_estimates.forEach(est => {
            if (est.stop_id === stops_src_dest.dest.stop_id) {
                vres.push(v);
            }
        });
    });
    // sort by arrival estimates. someone double check if its already sorted
    vres.sort((a, b) => {
        return a.arrival_estimates[0].arrival_at - b.arrival_estimates[0].arrival_at;
    });

    return {
        // distance and duration from user_pos to src
        distance: stops_src_dest.src.distance,
        duration: stops_src_dest.src.duration,
        start_address: stops_src_dest.src.name,
        end_address: stops_src_dest.dest.name,
        vehicles: vres,
    };
}

//TODO need to return more than one stop in case that stop has no vehicles in which case we can discard that.
const distanceToNearbyStop = async user_pos => {
    const stops = await nearbyStops({lat : user_pos.lat, lng : user_pos.lng},null);
    if(!stops){
        throw new Error("Error in getting nearbyStops in distanceToNearbyStop");
    }
    //get directions from the user to the three stops, lets do one for now.
    stops.slice(0,4);
    const stop_pos = new Position(stops[0].location.lat,stops[0].location.lng);
    const data = await directions({user_pos: user_pos.toString(), nearest_stop_pos: stop_pos.toString()});

    if (!data) {
        throw new Error("res is  null or res is undefined");
    }
    const distance = data.json.routes[0].legs[0].distance.text; // .replace(/\D/g,'');
    const duration = data.json.routes[0].legs[0].duration.text; //  .replace(/\D/g,'');
    return {name: stops[0].name, stop_id: stops[0].stop_id, distance, duration};

}

// directions API
const directions = async (args) => {
    return await queryMapsAPI("directions", args);
};


// distance matrix API
const distance = async args => {};
// travel time from one stop to another stop via bus
const travelTime = async args => {};
// get lat,lng from address
const geocode = async args => {};

module.exports = Directions;
