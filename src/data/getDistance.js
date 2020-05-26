export default function getDistance(coords1, coords2) {
    
    //getDistance(lat1, lon1, lat2, lon2)
    let lat1 = coords1.latitude, lon1 = coords1.longitude;
    let lat2 = coords2.latitude, lon2 = coords2.longitude;
    
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}