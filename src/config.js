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
          'X-RapidAPI-Key':'hHcLr1qWHDmshwibREtIrhryL9bcp1Fw9AQjsnCiZyEzRrJKOS', // prob should do something abt this 
     },

     RUTGERS_PLACES_API_URL: 'https://myapps.rutgers.edu/myr-services/RUBuildings/search/mdb/new%20brunswick',
     GMAP_API_URL : 'http://maps.googleapis.com/maps/api',
     GMAP_API_KEY: 'AIzaSyBG5HdtAIB3OV-jC37XmrrgnW4T2Leep8E',
};

