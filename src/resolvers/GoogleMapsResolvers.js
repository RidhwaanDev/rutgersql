const {queryMapsAPI} = require('../network');
// resolvers for Google Maps API
const GoogleMapsResolvers = {
    directions : (args) => {},
    distance   : (args) => {},
    geocode    : (args) => {},
};

/**

 input: lat,lng of user => (pos), String of destination => (dest) => geocode(dest) => lat,lng dest

 procedure:
 find closest stop to (dest) => STOP_B
 find closest stop to (user) => STOP_A
 find all route arrivals for STOP_A that go to STOP_B => [arrivals_A_to_B]

 **/

// STOP_A -> STOP_B
const directions = args => {

};


const distance = args => {
};

const geocode = args => {
    const api_name = 'geocode';
    // queryMapsAPI('geocode',)
};

// travel time from one stop to another stop via bus
const travelTime = args => {

};


module.exports = GoogleMapsResolvers;
