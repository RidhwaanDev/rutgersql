const config = require('./config');
const {Position, distance} = require('./position');
// const chalk = require('chalk');
// const queryAPI = require('./network')
const log = console.log;

const {getStops, getRoutes, getSegments, getVehicles} = require('./baseResolvers');

// complex resolvers that call the API multiple time times to do fancy stuff. Depends on baseResolvers
const complexResolvers = {
    vehiclesByName : (args,context) => {
        return getVehiclesByName(args);
    },
    segmentsByName : (args,context) => {
        return getSegmentsByName(args);
    },
    routesByName: (args,context) => {
        return getRoutesByName(args);
    },
    stopsWithRoutes : (args,context) => {
        return getStopsWithRoutes(args);
    },
    nearbyStops : (args,context) => {
        return getNearbyStops(args);
    },
};
// take in lat,lng and returns the nearest stops
function getNearbyStops(args){
    // ths location of the person
    const userPos = new Position(args['lat1'],args['lon1']);
    return getStops(null)
        .then(res => {
            const stops = res['data'];
            // add distance to each stop object
            stops.forEach(it => {
                const stop_distance = distance(userPos, new Position(it.location.lat, it.location.lng));
                it['distance'] = stop_distance;
            });
            // then sort all the objects by distance
            stops.sort((a,b) => {
                return a['distance'] - b['distance']
            });

            return stops;
        });
}

// takes the route name like 'A' or 'LX' and gets the segments.
function getSegmentsByName(args){
    // get route_name from args
    const route_name = args['name'];
    return getRoutes(null)
        .then((response) => {
            const res = response['data'];
            const map = {};
            res.forEach((it) => {map[it.long_name] = it.route_id});
            const params = {routes: map[route_name]};
            return getSegments(params);
        })
        .then((segments) => {
        return segments;
    });
}

// takes the route name like 'A' or 'LX' and gets all the associated vehicles.
function getVehiclesByName(args){
    // get route_name from args
    const route_name = args['name'];
    const result = getRoutes(null)
        .then((response) => {
            // get all the routes and map the route id with its name. For example : ( "4040102" : "Route A )
            const res = response['data'];
            const map = {};
            res.forEach((it) => {map[it.route_id] = it.long_name});
            // get all the vehicles and filter the ones where the route_id in map returns the route name that we want.
            return getVehicles(config.route_id_test)
                .then((response) => {
                    const res = response['data'];
                    return res.filter((it) => map[it.route_id] === route_name);
                });
        });

    return result.then(vehicles_list => {return vehicles_list});
}

// get routes, then get vehicles then sort vehicles by shortest arrival time then combine both into one object.
function getRoutesByName(args){
    const route_result = getRoutes(null)
        .then((response) => {
            const res = response['data'];
            const route_obj = res.filter((it) => (it.long_name == args['name']));
            return vehicle_result = getVehiclesByName(args)
                .then((vehicles) => {
                    // sort the arrivals of each vehicle
                    vehicles.forEach((vehicle) => {
                        const arrival_est = vehicle['arrival_estimates'];
                        arrival_est.sort((a,b) => {
                            return a['arrival_at'] - b['arrival_at'];
                        });
                    });
                    // sort the buses based on arrival times of the first arrival_estimate cuz those are sorted already.
                    vehicles.sort((a,b) => { return (a['arrival_estimates'])[0] - (b['arrival_estimates'])[0] });
                    // combine route_obj and response
                    const result = {...route_obj, vehicles};
                    return result;
                });
        })
        // give each stop_id its stop name.
        .then((response) => {
            return getStops(null)
                .then((stops_response) => {
                    const stop_id_2_name = {};
                    // map each stop_id from stops to its name
                    const stops = stops_response['data'];
                    stops.forEach((stop) => { stop_id_2_name[stop['stop_id']] = stop['name']});
                    response['vehicles'].forEach((vehicle) => {
                        vehicle['arrival_estimates'].forEach((est) => {
                            est['name'] = stop_id_2_name[est['stop_id']];
                        });
                    });
                    return response;
                });

        })
        .then(final_result => {
            // segments is useless in this case and clutters the JSON output.
            delete (final_result['0'])['segments'];
            let vehicles = final_result['vehicles'];
            // combine the route object and the vehicles object
            return { ...final_result['0'],vehicles};
        });
    return route_result.then(res => {return res});

}

// First get all the routes that stop at that stop.
// Then from all of those routes, get all the vehicles and sort by the arrival time to that stop.
function getStopsWithRoutes(){
    /**
     *  get all stops [stops]
     *  get all routes [routes]
     *  get all vehicles [vehicles]
     *  for each stop s in [stops] , find the routes coming to it [routeids]
     *  for each vehicle v in [vehicles] filter out all vehicles except the routeid r in [routeids]
     *  find all the arrival_estimates with stop_id equal to s.stop_id. if found, add v to a stop object.
     *
     */
        // get all stops
    const res = getStops(null)
            .then(stops => {
                return stops;
            })
            .then(stops => {
                return getRoutes(null).then(routes => {
                    const combined = {stops,routes};
                    return combined;
                });
            })
            .then(stops_routes => {
                return getVehicles([config.route_id_test,config.route_id_test_2]).then(vehicles => {
                    const combined = {vehicles,...stops_routes};
                    return combined;
                });
            })
            .then(combined => {
                // combined has all routes, all stops, and all vehicles.
                const routes = (combined['routes'])['data'];
                const stops = (combined['stops'])['data'];
                const vehicles = (combined['vehicles'])['data'];
                // r u ready for some O(n^3) magic ?!?!
                // map each stop to its routes
                let stopid_to_routeid = {};
                stops.forEach(s => {
                    routes.forEach(r => {
                        const route_stops = r['stops'];
                        const rt_name = r['long_name'];
                        const filtered = route_stops.filter(stop => stop === s['stop_id']);
                        //  stop is on the route
                        if(filtered.length >= 1){
                            if(stopid_to_routeid[s['stop_id']] == undefined){
                                stopid_to_routeid[s['stop_id']] = new Array();
                            } else {
                                (stopid_to_routeid[s['stop_id']]).push(r['route_id']);
                            }
                        }
                    });
                });
                // for each stop
                Object.keys(stopid_to_routeid).forEach( stop_id => {
                    const buses = vehicles.filter(b => stopid_to_routeid[stop_id].includes(b['route_id']));
                    // buses is all the vehicles coming to the stop.
                    buses.sort((a,b) => {
                        return (a['arrival_estimates'])['arrival_at'] - (b['arrival_estimates'])['arrival_at']
                    });
                    stopid_to_routeid[stop_id] = buses;
                });
                // now add all buses to their respective stops in the stops object
                stops.forEach(stop => {
                    stop['vehicles'] = stopid_to_routeid[stop['stop_id']];
                });
                return stops;
            });
    return res.then(final_res => {return final_res});
}

module.exports = complexResolvers;
