const config = require('../../config');
const Position = require('../../structures/position');
const globalCache = require('../../structures/cache');
const log = console.log;
const {getStops, getRoutes, getSegments, getVehicles, getArrivals} = require('./transloc_base');

const api = {
    vehiclesByName : (args) => {
        return getVehiclesByName(args);
    },
    segmentsByName : (args) => {
        return getSegmentsByName(args);
    },
    routesByName: (args) => {
        return getRoutesByName(args);
    },
    stopsWithRoutes : (args) => {
        return getStopsWithRoutes(args);
    },
    nearbyStops : (args) => {
        return getNearbyStops(args);
    },
};

// take in lat,lng and returns the nearest stops
async function getNearbyStops(args){
    // ths location of the person
    const userPos = new Position(args['lat'],args['lng']);
    const res = await getStops(null);

    if(!res){
        log("we have a problem");
    }
    const stops = res['data'];
    // add distance to each stop object
    stops.forEach(it => {
        const stopPos = new Position(it.location.lat, it.location.lng);
        const stop_distance = Position.distance(userPos, stopPos);
        it['distance'] = stop_distance;
    });
    // then sort all the objects by distance
    stops.sort((a,b) => {
        return a['distance'] - b['distance']
    });

    // all the routes that each stop has. Set instead of array because we dont want duplicate elements
    let routes = new Set();

    // add each stops' routes to the routes obj
    stops.forEach(stop =>{
        const rts = stop['routes'];
        for(let i = 0; i < rts.length; i++){
            routes.add(rts[i]);
        }
    });

    let temp = [];
    routes.forEach(it => temp.push(it));
    const str = temp.join(',');

    // TODO arrival is undefined sometimes
    // now call arrival estimates with all the routes for only ten stops.
    for (let i = 0; i < 10; i++) {
        const arriv = await getArrivals({str, stops: (stops[i])['stop_id']});
        if(!arriv || !arriv.data[0] || !stops){
            log('arrivals undefined');
        } else {
            stops[i].arrivals = arriv.data[0].arrivals;
        }
    }

    return stops;
}

// takes the route name like 'A' or 'LX' and gets the segments.
async function getSegmentsByName(args){
    // get route_name from args
    const route_name = args['name'];
    const response = await getRoutes(null);
    const res = response['data'];
    const map = {};

    res.forEach((it) => {map[it.long_name] = it.route_id});

    // need to test this
    globalCache.set(config.ROUTE_TO_NAME_KEY,map);

    const params = {routes: map[route_name]};
    const segments = await getSegments(params);
    return segments;
};

// takes the route name like 'A' or 'LX' and gets all the associated vehicles.
async function getVehiclesByName(args){
    // get route_name from args
    const route_name = args['name'];
    const routes = await getRoutes(null);
    const res = routes['data'];
    const map = {};

    // map route_id to name
    res.forEach((it) => {map[it.route_id] = it.long_name});
    const vehicles = await getVehicles();
    let v = vehicles['data'];
    const vehicles_filtered = v.filter(it => map[it.route_id] === route_name);
    return vehicles_filtered;
}

// TODO this endpoint is way too slow. needs to be much faster. 1.5 seconds
// get routes, then get vehicles then sort vehicles by shortest arrival time then combine both into one object, then get stops for the routes;
async function getRoutesByName (args){
    const rt_name = args['name'];
    const response = await getRoutes(null);
    const res = response['data'];
    const route_obj = res.filter((it) => (it.long_name === rt_name));
    const rt_id = (route_obj['0']).route_id;

    const vehicles = await getVehiclesByName(args);
    // sort the arrivals of each vehicle
    vehicles.forEach((vehicle) => {
        const arrival_est = vehicle['arrival_estimates'];
        arrival_est.sort((a, b) => {
            return a['arrival_at'] - b['arrival_at'];
        });
    });

    // sort the buses based on arrival times of the first arrival_estimate cuz those are sorted already.
    vehicles.sort((a, b) => {
        return (a['arrival_estimates'])[0] - (b['arrival_estimates'])[0]
    });
    // combine route_obj and response
    const result = {...route_obj, vehicles, rt_id};
    const stops_response = await getStops(null);

    // give each stop_id its stop name.
    const stop_id_2_name = {};
    // map each stop_id from stops to its name
    const stops = stops_response['data'];
    stops.forEach((stop) => {
        stop_id_2_name[stop['stop_id']] = stop['name']
    });

    // get the stops only on the route passed in
    const stops_filtered = [];

    // TODO clean this up
    stops.forEach((stop) => {
        stop.routes.forEach(route => {
            if (route === result.rt_id) {
                stops_filtered.push(stop);
                return;
            }
        });
    });

    result['vehicles'].forEach((vehicle) => {
        // add stop name to each vehicle estimate
        vehicle['arrival_estimates'].forEach((est) => {
            est['name'] = stop_id_2_name[est['stop_id']];
        });
    });
    (result['0'])['stops'] = stops_filtered;

    const res_stops_filtered = result['0'].stops;
    const stop_id_to_arrivals = {};

    // TODO this is really slow, need to speed up
    const res_arrivals = await getArrivals({routes: response.rt_id});
    const data = res_arrivals['data'];
    // map each stop_id to its corresponding arrivals
    data.forEach(arrival => {
        stop_id_to_arrivals[arrival.stop_id] = arrival.arrivals;
    });

    // put arrival estimates for each stop using the map (stop_id_to_arrivals);
    res_stops_filtered.forEach(stop => {
        stop['arrivals'] = stop_id_to_arrivals[stop.stop_id];
    });

    (result['0'])['stops'] = res_stops_filtered;
    // segments is useless in this case and clutters the JSON output.
    if (result['0'] != undefined) {
        delete (result['0'])['segments'];
    }

    result['0'].vehicles = result.vehicles;

    // remove duplicate vehicles array
    delete(result.vehicles);

    return result['0']
};

// First get all the routes that stop at that stop.
// Then from all of those routes, get all the vehicles and sort by the arrival time to that stop.

async function getStopsWithRoutes(){
    /**
     *  get all stops [stops]
     *  get all routes [routes]
     *  get all vehicles [vehicles]
     *  for each stop s in [stops] , find the routes coming to it [routeids]
     *  for each vehicle v in [vehicles] filter out all vehicles except the routeid r in [routeids]
     *  find all the arrival_estimates with stop_id equal to s.stop_id. if found, add v to a stop object.
     *
     */

    const stops = await getStops();
    const routes = await getRoutes();
    const vehicles = await getVehicles();

    let stopid_to_routeid = {};

    log(stops);
    stops['data'].forEach(s => {
        routes['data'].forEach(r => {
            const route_stops = r['stops'];
            const rt_name = r['long_name'];
            const filtered = route_stops.filter(stop => stop === s['stop_id']);
            //  stop is on the route
            if(filtered.length >= 1){
                if(stopid_to_routeid[s['stop_id']] === undefined){
                    stopid_to_routeid[s['stop_id']] = [];
                } else {
                    (stopid_to_routeid[s['stop_id']]).push(r['route_id']);
                }
            }
        });
    });

    // for each stop
    Object.keys(stopid_to_routeid).forEach( stop_id => {
        const buses = vehicles['data'].filter(b => stopid_to_routeid[stop_id].includes(b['route_id']));
        // buses is all the vehicles coming to the stop.
        buses.sort((a,b) => {
            return (a['arrival_estimates'])['arrival_at'] - (b['arrival_estimates'])['arrival_at']
        });
        stopid_to_routeid[stop_id] = buses;
    });
    // now add all buses to their respective stops in the stops object
    stops['data'].forEach(stop => {
        stop['vehicles'] = stopid_to_routeid[stop['stop_id']];
    });

    return stops;
};

module.exports = {
    complexResolvers: api
};
