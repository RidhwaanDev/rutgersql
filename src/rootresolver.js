const {baseResolvers} = require('./baseResolvers');
const complexResolvers = require('./complexResolvers');
// just combine the two
const resolvers = {...baseResolvers, ...complexResolvers};

module.exports = resolvers;
