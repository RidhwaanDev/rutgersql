# rutgersql
 A GraphQL API for Rutgers Bus
## How to access the server
 Server is located at : [https://zjq1aw68ij.execute-api.us-east-1.amazonaws.com/alpha](https://zjq1aw68ij.execute-api.us-east-1.amazonaws.com/alpha) 

This opens up the Graphiql browser interface where you can test queries. 

##  Usage example
*NOTE: Paste each query into the Graphiql browser interface to see the result.* 

The best way to figure out how to make queries is to look at [schema.js](https://github.com/RidhwaanDev/rutgersql/blob/master/src/schema.js) 
Your query should match the schema.

Here are a few examples. These do not cover all the endpoints.

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

### How about passing parameters?

Get buses by name
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
routes by name ( with less info )

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
- refactor the code base
- separate the code into modules
- document the code better
- cache data
