const assert = require('assert');
const resolvers = require('../src/rootresolver');
const routes = [];

const base = require('/src/resolvers/base');
const complex = require('/src/resolvers/complex');
const log = consol.log;
// test transloc API
describe('transloc_api', () => {
    describe('routes', () => {
        it('should not return null for any routes',() => {
            const res = base.getRoutes(null)
                .then(routes => {log(routes)});
            assert.notEqual(res,null);
        });
    });

    describe('stops', () => {
        it('should not return null for any stops',() => {
            // TODO
            const res = base.getStops(null)
                .then(stops=> {log(stops)});
            assert.notEqual(res,null);
        });

    });

    describe('vehicles', () => {
        it('should not return null for any vehicles',() => {
            // TODO
            const res = base.getVehicles(null)
                .then(vehicles => {log(vehicles)});
            assert.notEqual(res,null);
        });
    });

    describe('arrivals', () => {
    });

    describe('segments', () => {

        assert.notEqual(res,null);
    });
});

// test complex resolvers
describe('complex_resolvers', () => {
    describe('getVehiclesByName', () => {

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
