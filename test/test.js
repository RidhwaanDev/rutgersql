require('dotenv').config();
const assert = require('assert');
const routes = [];

const {baseResolvers} = require('../src/resolvers/base');
const log = console.log;

// test transloc API
describe('transloc_api', () => {
    describe('routes', () => {
        it('it should get all the routes',() => {

        });
    });

    describe('stops', () => {
        it('should not return null for any stops',() => {
            // TODO
        });

    });

    describe('vehicles', () => {
        it('should not return null for any vehicles',() => {
            // TODO
        });
    });

    describe('arrivals', () => {
    });

    describe('segments', () => {
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
