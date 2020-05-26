import getDistance from './getDistance';

export const mergeStationData = ({ stationInfo, stationStatus, usePosition, currentPosition }) => {
    const sortFunc = (stationA, stationB) => {
        if (Number(stationA.station_id) < Number(stationB.station_id)) {
            return -1;
        } else {
            return 1;
        }
    }

    const sortDistance = (stationA, stationB) => {
        if (Number(stationA.d) < Number(stationB.d)) {
            return -1;
        } else {
            return 1;
        }
    }

    const stationInfoSorted = stationInfo.data.stations.sort(sortFunc);
    const stationStatusSorted = stationStatus.data.stations.sort(sortFunc);
    const mergedStationData = stationInfoSorted.map((station, idx) => {
        if (stationInfoSorted.length === stationStatusSorted.length &&
            station.station_id === stationStatusSorted[idx].station_id) {
            const d = (!usePosition) ? -1 : getDistance(currentPosition, { latitude: station.lat, longitude: station.lon });
            return { ...station, ...stationStatusSorted[idx], d }
        }else {
            const d = (!usePosition) ? -1 : getDistance(currentPosition, { latitude: station.lat, longitude: station.lon });
            return { ...station, num_bikes_available: -1, num_docks_available: -1, d  }
        }
    });
    return !usePosition ? mergedStationData : mergedStationData.sort(sortDistance);
}
