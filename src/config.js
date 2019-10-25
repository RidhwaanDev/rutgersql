module.exports = {
     API_URL: 'https://transloc-api-1-2.p.rapidapi.com',
     geo_area: '40.506831,-74.456645|15000',
     route_id_test : '4012666', // summer 2
     route_id_test_2: '401266',
     stop_id_test : '4229492',
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
     GMAP_API_KEY: process.env.GMAP_API_KEY,

     // test user_lat , user_lng
     user_lat :40.522847,
     user_lng :-74.455341,

     // generate a google map api url
     generateGMAP_API : (API_ENDPOINT) => {
         return `https://maps.googleapis.com/maps/api/${API_ENDPOINT}/json`;
     }
};



