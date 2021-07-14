# rutgersql
A GraphQL API for Rutgers Bus.

July 14, 2021 Update: Route names have changed so this code will most likely not work. I am not sure what else has changed in the Transloc API. But 
one thing is for sure, I will never touch this project again. RIP.

## Run server locally

```
git clone https://github.com/RidhwaanDev/rutgersql.git
npm i
npm start
```

# Run mocha tests
```
npm test
```

# Run load tests (artillery.io)
```
npm install -g artillery ( might need to run as sudo, also omitting -g might not work)
artillery run graphql_loadtest.yml (load test the graphQL server)
artillery run socket_io_loadtest.yml (load test socket.io)
```
A server for socket.io and graphQL should start up. 

##### Remember to place your  X-RapidAPI-Key in  [config.js](https://github.com/RidhwaanDev/rutgersql/blob/master/src/config.js) 

To get an X-RapidAPI-Key go to this link [url](https://rapidapi.com/transloc/api/openapi-1-2) and log in/sign up for an API_KEY.

### How the code is structured

All API endpoints / logic are in the resolvers directory. All the resolvers all collected into one big object in rootresolvers.js which is then exported to app.js for use
with the GraphQL server. 


### Queries
```		routes : RouteResult,
		stops : StopResult
		arrivals(routes : [String], stops : [String]) : ArrivalEst_Result
		vehicles(routes: [String]) : VehiclesResult
		segments(route : String) : SegmentsResult
		vehiclesByName(name: String!) : [Vehicle]
		segmentsByName(name: String!) : SegmentsResult
		routesByName(name: String) : [RoutesByNameResult]
		stopsWithRoutes : [StopsWithRoutesResult]
		nearbyStops(lat1 : Float!, lon1: Float!) : [Stop] 
        directions(user_lat: Float!, user_lng: Float!, dest_lat: Float!, dest_lng: Float!) : DirectionResult
        alerts : [AlertsResult]
```
### Usage

#### GraphQL usage:

Once the server has started and you see the Graphiql interface in your browser try these queries out:

```
query {
  alerts {
    title
    guid
    pubDate
    description
  }
}
```

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
  } 
 }
}
```

See schema.js for all the fields you can query

#### Socket.io

You will need a socket.io client library. Once the socket.io server is up connect to it with your client. See socketio.js to see sockets or "namespaces" you can connect to for interval data.
