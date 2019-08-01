// construct schema file from schema string. Return schema object
const { buildSchema } = require('graphql');
const schema = buildSchema(`

	type Query {
		routes(campus : String!) : RouteResult,
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

module.exports = schema;
