# rutgersql
A GraphQL API for Rutgers Bus.

Backend for [rutgers-flutter](https://github.com/mattweil/rutgers-flutter)

## How to access the server
Server is located at [url](https://qb5gf6uh4c.execute-api.us-east-1.amazonaws.com/dev/query) 

This opens up the Graphiql browser interface where you can test queries. 

## Local testing

```
git clone https://github.com/RidhwaanDev/rutgersql.git
npm i
npm start
```

run
```
npm start
```

test
```
npm test
```
##### Remember to place your  X-RapidAPI-Key in  [config.js](https://github.com/RidhwaanDev/rutgersql/blob/master/src/config.js) 

To get an X-RapidAPI-Key go to this link [url](https://rapidapi.com/transloc/api/openapi-1-2) and log in/sign up for an API_KEY.

### Queries

```
routes : RouteResult,
stops : StopResult
arrivals(routes : [String], stops : [String]) : ArrivalEst_Result
vehicles(routes: [String]) : VehiclesResult
segments(route : String!) : SegmentsResult
vehiclesByName(name: String!) : [Vehicle]
segmentsByName(name: String!) : SegmentsResult
routesByName(name: String!) : RoutesByNameResult
stopsWithRoutes : [StopsWithRoutesResult]
nearbyStops(lat1 : Float!, lon1: Float!) : [Stop] 
directions(user_lat: Float!, user_lng: Float!, dest_lat: Float!, dest_lng: Float!) : DirectionResult
