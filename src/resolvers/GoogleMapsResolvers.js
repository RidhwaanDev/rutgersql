const {queryMapsAPI} = require('../network');
// resolvers for Google Maps
const GoogleMapsResolvers = {
    directions : (args) => {},
    distance   : (args) => {},
    geocode    : (args) => {},
};

/**
 The Weilgorithim

 input: lat,lng of user => (pos), lat,lng of destination => (dest)
 procedure:
    find closest stop to (dest) => STOP_B
    find closest stop to (user) => STOP_A
    find directions ( directions1) to STOP_A
    find route arrivals, (R),  that go to STOP_B from STOP_A
    find directions from STOP_B to dest
 **/

/**
 *
 Weilgorithim first iteration

 input: lat,lng of user => (pos), lat,lng of destination => (dest)
 procedure:
 find closest stop to (dest) => STOP_B
 find closest stop to (user) => STOP_A
 find all route arrivals for STOP_A that go to STOP_B => [arrivals_A_to_B]

 **/

// STOP_A -> STOP_B
const directions = args => {

}


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
