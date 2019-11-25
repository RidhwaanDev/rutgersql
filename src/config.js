module.exports = {
     API_URL: 'https://transloc-api-1-2.p.rapidapi.com',
     geo_area: '40.506831,-74.456645|15000',
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

     // test user_lat , user_lng . These coords are next to Buell apartment (which should be closest stop )
     user_lat :   40.522847,
     user_lng :  -74.455341,

     // test user_lat 2, user_lng 2. Next to Hill center
     user_lat_2 : 40.521926,
     user_lng_2 : -74.462228,

     // test dest_lat , dest_lng. These coords are next to Scott Hall (which should be closest stop )
     dest_lat :40.499820,
     dest_lng : -74.448530,

};


