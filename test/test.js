require('dotenv').config();
const assert = require('assert');
const {baseResolvers} = require('../src/resolvers/base');
const {complexResolvers} = require('../src/resolvers/complex');
const log = console.log;

// test base resolvers
describe('resolvers', () => {
    describe('routes', () => {
        it('it should get all the routes', async () => {
            const routes = await baseResolvers.routes();
            assert(routes !== null);
            assert(routes !== undefined);
            assert(routes['data'] !== null);
            assert(routes['data'] !== undefined);
            assert((routes['data']).length > 1);
        });
    });

    describe('stops', () => {
        it('it should get all the stops', async () => {
            const stops = await baseResolvers.stops();
            assert(stops !== null);
            assert(stops !== undefined);
            assert(stops['data'] !== null);
            assert(stops['data'] !== undefined);
            assert(stops['data'].length != 0);
            assert(stops['data'].length > 10);
        });
    });

    describe('vehicles', async () => {
        it('it should get all the vehicles', async () => {
            const vehicles = await baseResolvers.vehicles();
            assert(vehicles !== null);
            assert(vehicles !== undefined);
            assert(vehicles['data'] !== null);
            assert(vehicles['data'] !== undefined);
            assert(vehicles['data'].length != 0);
            assert(vehicles['data'].length > 10);
        });
    });


    describe('arrivals', async () => {
        it('it should get all the vehicles', async () => {
            const arrivals = await baseResolvers.arrivals();
            assert(arrivals !== null);
            assert(arrivals !== undefined);
            assert(arrivals['data'] !== null);
            assert(arrivals['data'] !== undefined);
            assert(arrivals['data'].length > 1);
        });
    });

    describe('segments', async () => {
        it('it should get all the vehicles', async () => {
            const segments = await baseResolvers.segments();
            assert(segments !== null);
            assert(segments !== undefined);
            assert(segments['data'] !== null);
            assert(segments['data'] !== undefined);
            assert(segments['data'].length > 1);
        });
    });

    describe('getVehiclesByName', async () => {
        it('it should get all the vehicles by name. should return ALL routes. see test.js', async () => {
            const routes = ["Route LX", "Route A", "Route H", "Route F", "Route EE", "Route B", "Route REXB", "Route REXL"];
            for (let i = 0; i < routes.length; i++) {
                const vehicles = await complexResolvers.vehiclesByName({name: routes[i]});
                assert(vehicles !== null);
                assert(vehicles !== undefined);
                assert(vehicles.length != 0);
            }
        });
    });

    describe('getRoutesByName', async () => {
        it('it should get all the vehicles by name. should return ALL routes. see test.js', async () => {
            const routes = ["Route LX", "Route A", "Route H", "Route F", "Route EE", "Route B", "Route REXB", "Route REXL"];
            for (let i = 0; i < routes.length; i++) {
                const data = await complexResolvers.routesByName({name: routes[i]});
                assert(data !== null);
                assert(data !== undefined);

                assert(data.vehicles !== null);
                assert(data.vehicles !== undefined);
                assert(data.vehicles.length > 0);

                assert(data.stops != null);
                assert(data.stops !== undefined);
                assert(data.stops.length > 0);
            }
        });
    });
});



// test complex resolvers
describe('complex_resolvers', () => {
    describe('getVehiclesByName', async () => {
        const routes = ["Route LX", "Route A", "Route H", "Route F", "Route EE", "Route B", "Route REXB", "Route REXL"];
        for(let i = 0; i < routes.length; i++){
            const vehicles = await complexResolvers.vehiclesByName( {name :routes[i]});
            assert(vehicles !== null);
            assert(vehicles !== undefined);
            assert(vehicles.length != 0);
        }
    });

    describe('getRoutesByName', () => {

    });

    describe('getSegmentsByName', () => {

    });

    describe('getStopsWithRoutes', () => {

    });

    describe('getNearbyStops', () => {

    });
});

// test cache


// test
