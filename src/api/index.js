import delve from 'dlv';

const options = {
    headers: {
        'client-identifier': 'kmuller-bikestations-test'
    }
}

export const getService = async (url) => {
    const response = await fetch(url, options);
    const service = await response.json();
    const feeds = delve(service, 'data.nb.feeds') || [];
    const systemInfoFeed = feeds.find(feed => {
        return feed.name === 'system_information';
    });
    const stationInfoFeed = feeds.find(feed => {
        return feed.name === 'station_information';
    });
    const stationStatusFeed = feeds.find(feed => {
        return feed.name === 'station_status';
    });

    const getSystemInfo = async () => {
        if (systemInfoFeed) {
            try {
                const response = await fetch(systemInfoFeed.url, options);
                const systemInfo = await response.json();
                return systemInfo;
            } catch (error) {
                console.log(error);
            }
        }else{
            console.log("Missing systemInfoFeed");
        }
        return null
    }

    const getStationInfo = async () => {
        if (stationInfoFeed) {
            try {
                const response = await fetch(stationInfoFeed.url.replace('http:', 'https:'), options);
                const stationInfo = await response.json();
                return stationInfo;
            } catch (error) {
                console.log(error);
            }
        }else{
            console.log("Missing stationInfoFeed");
        }
        return null
    }

    const getStationStatus = async () => {
        if (stationStatusFeed) {
            try {
                const response = await fetch(stationStatusFeed.url.replace('http:', 'https:'), options);
                const stationStatus = await response.json();
                return stationStatus;
            } catch (error) {
                console.log(error);
            }
        }else{
            console.log("Missing stationStatusFeed");
        }
        return null
    }
    return { getSystemInfo, getStationInfo, getStationStatus }
};

