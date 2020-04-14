module.exports = {
    API_URL: 'https://transloc-api-1-2.p.rapidapi.com',
    SOCKET_URL : "",
    geo_area: '40.506831,-74.456645|15000',
    stop_id_test : '4229492',
    route_h : 4012628,
    route_lx : 4012630,
    agency: 1323,
    /** HOW TO PUT YOUR API_KEY
     * First Way: Just put your API_KEY in directly
     * Second Way: Create a file in the root directory called .env ( no name, just .env) and place your api key in the following format: API_KEY=YOUR_API_KEY  (no quotes)
     */
    HEADERS: {
        'X-RapidAPI-Host': 'transloc-api-1-2.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.TRANSLOC_API_KEY,
    },
    TRANSLOC_ANNOUCEMENTS: 'https://rutgers.transloc.com/announcements/rss',
    RUTGERS_PLACES_API_URL: 'https://myapps.rutgers.edu/myr-services/RUBuildings/search/mdb/new%20brunswick',
    GMAP_API_URL : 'https://maps.googleapis.com/maps/api/distancematrix/json',
    /**
     * Put GMAP key in .env file
     */
    GMAP_API_KEY: process.env.GMAP_API_KEY,

    // a bunch of coordinates to be copy and pasted into GraphiQL
    latlngtest : {

        buellapt_lat: 40.522847,
        buellapt_lng: -74.455341,

        hill_center_lat: 40.521926,
        hill_center_lng: -74.462228,

        scotth_lat: 40.499820,
        scotth_lng: -74.448530,

        lsc_lat: 40.523907,
        lsc_lng: -74.436665,
    }
};
