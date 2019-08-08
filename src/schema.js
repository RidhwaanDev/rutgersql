// construct schema file from schema string. Return schema object
const { buildSchema } = require('graphql');
module.exports = buildSchema(`

	type Query {
		routes : RouteResult,
		stops : StopResult
		# vehicles(routes: [String]) : VehiclesResult
		vehiclesByName(routeName: String!) : VehiclesResult
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
	    description : String,
	    short_name : String,
		route_id : String,
		color : String,
		is_active: Boolean,
		agency_id: Int,
		text_color : String,
		long_name : String,
		url : String,
		# segments need to be added
		is_hidden : Boolean,
		type : String,
        stops : [String]	
	}
	
	type StopResult{
        rate_limit: Int,
        expires_in: Int,
        api_latest_version: String,
        generated_on: String,
        data: [Stop],
        api_version: String
	}

	type Stop {
		stop_id: String,
		name : String,
		routes : [String],
		location : Position,
	}	
	
	type VehiclesResult {
        rate_limit: Int,
        expires_in: Int,
        api_latest_version: String,
        generated_on: String,
        data : [Vehicle],
        api_version: String
	}
	
	type Vehicle {
        standing_capacity : Int,
        description : String,
        last_updated_on: String,
        call_name : String,
        speed : Float,
        vehicle_id : String,
        segment_id : String,
        passenger_load : Float,
        route_id : String,
        # arrival_estimates
        tracking_status: String,
        location : Position,
        heading : Int  
	}
	
	type ArrivalEst_Result {
        rate_limit: Int,
        expires_in: Int,
        api_latest_version: String,
        generated_on: String,
        data: [ArrivalEst],
        api_version: String
	}
    type ArrivalEst {	
        data : Int 
    }
	type Position {
        lat: Float,
        lng: Float	
	}
`);

