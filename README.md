# rutgersql
A GraphQL API for Rutgers Bus.

Backend for [rutgers-flutter](https://github.com/mattweil/rutgers-flutter)
## How to access the server
Server is located at [url](https://qb5gf6uh4c.execute-api.us-east-1.amazonaws.com/dev/query) 

This opens up the Graphiql browser interface where you can test queries. 
## Run locally 

*[app.js](https://github.com/RidhwaanDev/rutgersql/blob/master/src/app.js) is the entry point for the application.*

```
git clone https://github.com/RidhwaanDev/rutgersql.git
npm i
npm start
```
##### Remember to place your  X-RapidAPI-Key in  [config.js](https://github.com/RidhwaanDev/rutgersql/blob/master/src/config.js) 

To get an X-RapidAPI-Key go to this link [url](https://rapidapi.com/transloc/api/openapi-1-2) and log in/sign up for an API_KEY.

To test the endpoints on transloc the agency_id for Rutgers is 1323 and the geo_area for New Brunswick is "40.506831,-74.456645|15000"

##  Usage example
#### *NOTE: Paste each query into the Graphiql browser interface to see the result.* 

The best way to figure out how to make queries and what to expect in the result is to look at [schema.js](https://github.com/RidhwaanDev/rutgersql/blob/master/src/schema.js) 
Your query should match the schema.

### all query types
Below are all the possible queries you can make
```
routes : RouteResult,
stops : StopResult
arrivals(routes : [String], stops : [String])
vehicles(routes: [String]) 
segments(route : String!) 
vehiclesByName(name: String!) 
segmentsByName(name: String!) 
routesByName(name: String!) 
stopsWithRoutes
nearbyStops(lat1 : Float!, lon1: Float!) : [Stop] 

```
Info about the brackets and exclamation
```
String -> single string ( can be omitted )
[String] -> array of strings
String! -> must pass in a string ( can't be omitted )
```
pass in parameters like this:
```
vehiclesByName(name:"Summer 1"){...}
```
See example queries below

### stops with all the incoming vehicles for that stop:
```
query {
  stopsWithRoutes {
    code
    description
    url
    parent_Station_id
    station_id
    location_type
    stop_id
    name
    vehicles {
      standing_capacity
      description
      last_updated_on
      call_name
      name
      speed
      vehicle_id
      segment_id
      passenger_load
      route_id
      tracking_status
      heading
    }
  }
}
```
### routes by name with all vehicles and segments for that route
```
query {
routesByName(name:"Summer 2") {
  description
  short_name
  route_id
  color
  is_active
  agency_id
  text_color
  long_name
  url
  is_hidden
  type
  vehicles {
    standing_capacity
    description
    last_updated_on
    call_name
    name
    speed
    vehicle_id
    segment_id
    passenger_load
    route_id
    tracking_status
    heading
    arrival_estimates {
      route_id
      arrival_at
      stop_id
     }
   }
   segments 
  }
}
```

### stops:
```
query {
stops {
  rate_limit
  expires_in
  api_latest_version
  generated_on
  api_version
  data {
    name
    stop_id
    location {
      lat
      lng
    }
    routes
	}
}
```
### stops with just name and location:
```
query {
stops {
  data {
     name
     location {
     	lat
     	lng
     }
}
```
### routes with all buses
```
query {
  routes {
    rate_limit
    expires_in
    api_latest_version
    generated_on
    api_version
    data {
      description
      short_name
      route_id
      color
      is_active
      agency_id
      text_color
      long_name
      url
      is_hidden
      type
      stops
      buses {
        rate_limit
        expires_in
        api_latest_version
        generated_on
        api_version
        data {
          standing_capacity
          description
          last_updated_on
          call_name
          speed
          vehicle_id
          segment_id
          passenger_load
          route_id
          tracking_status
          heading
        }
      }
    }
  }
}
```
### Alternatively, if you just want the important stuff
```
query {
  routes {
    data {
      route_id
      color
      is_active
      url
      is_hidden
      stops
      buses {
        data {
          speed
          route_id
          location {
	    lat
            lng
          }
        }
      }
    }
}
```
### vehicles 
```
query {
  vehicles {
    rate_limit
    expires_in
    api_latest_version
    generated_on
    api_version
    data {
      standing_capacity
      description
      last_updated_on
      call_name
      speed
      vehicle_id
      segment_id
      passenger_load
      route_id
      tracking_status
      heading
      location{
        lat
        lng
      }
    }
  }
}
```
The other end points are pretty much the same.

### Get buses by name
```
query {
  vehiclesByName(name:"Summer 1") {
    standing_capacity
    description
    last_updated_on
    call_name
    speed
    vehicle_id
    segment_id
    passenger_load
    route_id
    tracking_status
    heading
    location {
	    lat
	    lng
	  }
}
```
### routes by name ( with less info )

```
query{
routesByName(name:"Summer 2") {
  data {
    description
    route_id
    is_active
    long_name
    buses {
      data {
        speed
        location{
          lat
          lng
        }
      }
    }
  }
 }
}
```


## Todo
- Use es6 like the cool kids
