// resolvers for directions and other
const {queryMapsAPI} = require('../network');
const {nearbyStops} = require('./complex')
const Position = require('../structures/position');
// resolvers for Google Maps API
const Directions = {
    distance      : args => {},
    geocode       : args => {},
    directions : args => {
        return getDirections(args).then(res => {return res});
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

// STOP_A -> STOP_B
const getDirections = (args) => {
    return new Promise((resolve, reject) => {
        log('getting directiosn');
        // user position, and final destination
        const user_pos = new Position(args.user_lat, args.user_lng);
        // const dest_pos = new Position(args.dest_lat, args.dest_lng);

        // get the closest stops to the user
        const final = nearbyStops({lat: user_pos.lat, lng : user_pos.lng},null)
            .then(stops => {
                // return the nearest three stops, so the user can choose, slice does not include end index so its [0,4)
                return stops.slice(0,4);
            })
            .then(nearest_stops => {
                // get directions from the user to the three stops, lets do one for now.
                // TODO fix this long peice of trash
                return directions({user_pos : user_pos.toString(), nearest_stop_pos: new Position(nearest_stops[0].location.lat,nearest_stops[0].location.lng).toString()},(res) => {
                    const distance = res.json.routes[0].legs[0].distance.text.replace(/\D/g,'');
                    const duration = res.json.routes[0].legs[0].duration.text.replace(/\D/g,'');

                    const ret_test = {distance,duration};
                    // log(`${distance} and ${duration}`);
                    resolve(ret_test);
                })
            });
    })
};


// distance matrix API
const distance = args => {

};
// directions API
const directions = (args, callback) => {
    // user_pos, dest_pos must be Strings, using a callback because Promise are finnicky
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
