// construct schema file from schema string. Return schema object
const { buildSchema } = require('graphql');
const schema = buildSchema(`

	type Query {
		routes : RouteResult,
		stops : StopResult
	}

	type RouteResult {
        rate_limit: Int,
        expires_in: Int,
        api_latest_version: String,
        generated_on: String,
        data: [Route]
        api_version: String
	}

	type Route {
		route_id : String,
		color : String,
		isActive : Boolean,
		text_color : String,
		long_name : String,
	}
	
	type StopResult{
        rate_limit: Int,
        expires_in: Int,
        api_latest_version: String,
        generated_on: String,
        data: [Stop]
        api_version: String
	}

	type Stop {
		stop_id: String,
		name : String,
	}
`);
module.exports = schema;
