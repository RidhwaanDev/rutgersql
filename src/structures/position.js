// should this be a class?
class Position{
    constructor(lat,lng){
       this.lat = lat;
       this.lng = lng;
    }

    toString(){
        return `${this.lat},${this.lng}`;
    }

    static distance(pos1,pos2){
        const lat1 = pos1.lat;
        const lon1 = pos1.lng;
        const lat2 = pos2.lat;
        const lon2 = pos2.lng;

        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }

        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta/180;

        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        // unit is K
        dist = dist * 1.609344;

        return dist;
    }
};

module.exports= Position;
