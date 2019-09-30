// combine all of our resolvers so GraphQL can link them to our queries in schema.js (methods must have same name as query)
const {baseResolvers} = require('./resolvers/BaseResolvers');
const complexResolvers = require('./resolvers/ComplexResolvers');
const gmapResolvers = require('./resolvers/GoogleMapsResolvers');
// just combine the two
const resolvers = {...baseResolvers, ...complexResolvers};

module.exports = resolvers;
