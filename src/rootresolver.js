// combine all of our resolvers so GraphQL can link them to our queries in schema.js (methods must have same name as query)
const {baseResolvers} = require('./resolvers/base');
const complexResolvers = require('./resolvers/complex');
const gmapResolvers = require('./resolvers/directions');
// just combine the two
const resolvers = {...baseResolvers, ...complexResolvers, ...gmapResolvers};

module.exports = resolvers;
