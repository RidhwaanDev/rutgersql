const complexResolvers = require('./complexResolvers');

// directions to next stop
class GoogleMapsResolvers {
     // take (lat,lng) of destination, (lat,lng) of user, // (commuter : parking pass data)
    directions (args){
        const nearbyStops = complexResolvers.nearbyStops(args,null);
    }

}
module.exports = GoogleMapsResolvers;





