const express = require('express');
const chalk = require('chalk');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
// const root = require('./resolvers');
const PORT = 8000;

// Initialize a GraphQL schema
let schema = buildSchema(`
	type Query {
		routes(campus : String!) : RouteResult,
		vehicles(campus : String!) : 
	}

	type RouteResult {
		rate_limit : Int,
		expires_in: Int,
		api_latest_version: String,
		generated_on: String,
		data : [Route]
	}

	type Route {
		route_id : String!,
		color : String!,
		text_color : String!,
		long_name : String!,
		# stops : [Stop]
	}

`);
// resolvers for graphql defined in resolvers.js
// const {getArrivals, getRoutes,getSegments,getVehicles,getStops} = require('./resolvers');
// let root = {
//     arrivals : getArrivals,
//     routes : getRoutes,
//     segments : getSegments,
//     vehicles : getVehicles,
//     stops : getStops,
// };

// Create an express server and a GraphQL endpoint
let app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

app.listen(PORT, () => chalk.bgGreen(`Now browse to localhost:${PORT}/graphql`));

