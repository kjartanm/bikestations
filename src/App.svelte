<script>
    const SERVICE_URL = 'https://gbfs.urbansharing.com/oslobysykkel.no/gbfs.json';

    import { onMount, onDestroy } from 'svelte';
    import { getService } from './api';
    import { mergeStationData } from './data';
    import getDistance from './data/getDistance';
    import StationTable from './StationTable.svelte';

    let stationInfo = { "data": { "stations": [] } };
    let stationStatus = { "data": { "stations": [] } };
    let intervalID = null;
    let usePosition = false;
    let currentPosition = { latitude: 59.911491, longitude: 10.757933 }; //Default middle of Oslo
    let timerId = null;

    $: stations = mergeStationData({ stationInfo, stationStatus, usePosition, currentPosition });

    onMount(async () => {
        const { getStationInfo, getStationStatus } = await getService(SERVICE_URL);
        stationInfo = await getStationInfo();
        stationStatus = await getStationStatus();
        if (stationStatus) {
            intervalID = setInterval(async () => {
                stationStatus = await getStationStatus();
            }, 10000);
        }
    });

    onDestroy(() => {
        clearInterval(intervalID);
        stopTracking();
    });

    const startTracking = () => {
        timerId = navigator.geolocation.watchPosition(({ coords }) => {
            if (currentPosition === null ||
                0.05 < getDistance(coords, currentPosition)) {
                currentPosition = coords;
            }
        }, function (error) {
            console.log("No GPS", error);
            stopTracking();
        }, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 10000
        });
    };

    const stopTracking = () => {
        if (timerId !== null) {
            navigator.geolocation.clearWatch(timerId);
            timerId = null;
        }
    };

    const toggleUsePosition = () => {

        if (usePosition) {
            startTracking();
        } else {
            stopTracking();
        }
    }
</script>
<header>
    <h2>Bikestations</h2>
    <div class="toggle-container">
        <input class="toggle-check" id="toggle" type="checkbox" bind:checked={usePosition}
            on:change={toggleUsePosition}>
        <label class="toggle-label" for="toggle">Use position</label>
    </div>
</header>

<main>
    <StationTable {stations} {usePosition} />
</main>

<style>
    main {
        width: 100%;
        max-width: 640px;
        padding: 0;
        margin: 0 auto;
        grid-area: main;
        position: relative;
        overflow: hidden;

    }

    header {
        width: 100%;
        max-width: 640px;
        padding: 0.5em;
        margin: 0 auto;
        grid-area: header;
    }

    h2 {
        margin: 0;
        display: inline-block;
    }

    .list-container {
        padding: 1em;
    }

    .toggle-container {
        position: relative;
        display: block;
        float: right;
        margin-top: .5em;
    }

    .toggle-check {
        position: absolute;
        opacity: 0;
    }

    .toggle-label::before {
        display: inline-block;
        background-color: lavender;
        border: 2px solid lightsteelblue;
        height: calc(1em + 2px);
        width: 2em;
        border-radius: calc(0.5em + 1px);
        content: ' ';
        position: relative;
        vertical-align: text-bottom;
        margin-left: 0.6em;
        margin-right: 0.6em;
    }

    .toggle-check:checked+.toggle-label:before {
        background-color: plum;
        border: 2px solid purple;
    }

    .toggle-label::after {
        display: inline-block;
        background-color: rgb(67, 67, 114);
        height: 1em;
        width: 1em;
        border-radius: 0.5em;
        content: ' ';
        position: relative;
        right: calc(100% - (1.5em + 3px));
        top: -2px;
        vertical-align: text-bottom;
    }

    .toggle-check:checked+.toggle-label:after {
        background-color: rgb(50, 10, 51);
        right: calc(100% - (2.5em + 3px));
    }

    @media (max-width: 640px) {

        header,
        main {
            max-width: none;
        }
    }
</style>