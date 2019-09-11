// construct schema file from schema string. Return schema object

// the indentation is off here but looks fine in WebStorm. idk how to fix.
const { buildSchema } = require('graphql');
module.exports = buildSchema(`
	type Query {
		routes : RouteResult,
		stops : StopResult
		arrivals(routes : [String]!, stops : [String]!) : ArrivalEst_Result
		vehicles(routes: [String]) : VehiclesResult
		segments(route : String!) : SegmentsResult
		vehiclesByName(name: String!) : [Vehicle]
		segmentsByName(name: String!) : SegmentsResult
		routesByName(name: String!) : RoutesByNameResult 
		stopsWithRoutes : [StopsWithRoutesResult]
		nearbyStops(lat1 : Float!, lon1: Float!) : [Stop] 
	}
    	
	type StopsWithRoutesResult {
       code : String,
       description : String,
       url : String,
       parent_Station_id : String,
       agency_ids : [String],
       station_id : String,
       location_type : String,
       location : Position,
       stop_id : String,
       routes : [String],
       name : String,
       vehicles : [Vehicle]
	}
	
	
    type RoutesByNameResult {
        vehicles : [Vehicle],
	    description : String,
	    short_name : String,
		route_id : String,
		color : String,
		segments : [String],
		is_active: Boolean,
        agency_id: Int,
        text_color: String,
        long_name: String ,
        url: String,
        is_hidden: Boolean ,
        type: String,
        stops : [String]
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
		is_hidden : Boolean,
		type : String,
		buses : [VehiclesResult],
		segments : [SegmentsResult],
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
		arrivals : [Arrival]
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
        name : String,
        speed : Float,
        vehicle_id : String,
        segment_id : String,
        passenger_load : Float,
        route_id : String,
        arrival_estimates : [VehicleArrivalEst]
        tracking_status: String,
        location : Position,
        heading : Int  
	}
	
	type VehicleArrivalEst {
	    route_id : String,
	    arrival_at : String,
	    stop_id : String
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
        arrivals : [Arrival]
        agency_id : Int,
        stop_id : String
    }
    
    type Arrival {
        route_id : String,
        vehicle_id : String,
        arrival_at : String,
        type : String 
    }
    
    type SegmentsResult {
        rate_limit: Int,
        expires_in: Int,
        api_latest_version: String,
        generated_on: String,
        data: [String],
        api_version: String
    } 
        
	type Position {
        lat: Float,
        lng: Float	
	}
`);

