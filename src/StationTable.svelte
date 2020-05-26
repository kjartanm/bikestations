<script>
    export let stations;
    export let usePosition;

    let filterDocks = false;
    let filterBikes = false;

    $: filteredList = stations.filter(station => {
        let keepBikes = true;
        let keepLocks = true;
        keepBikes = keepBikes && filterBikes ? station.num_bikes_available > 0 : true;
        keepLocks = keepLocks && filterDocks ? station.num_docks_available > 0 : true;
        return keepBikes && keepLocks;
    })

</script>

<div class="datatable datatable-useposition--{usePosition}">
    <div class="datahead datagrid">
        <div class="datacell datacell-useposition--{usePosition}">Km</div>
        <div class="datacell">Station</div>
        <div class="datacell">Bikes <input type="checkbox" bind:checked={filterBikes}></div>
        <div class="datacell">Locks <input type="checkbox" bind:checked={filterDocks}></div>
    </div>
    <div class="databody datagrid">
        {#each filteredList as station}
            <div class="datacell datacell-useposition--{usePosition}">{Math.floor(station.d * 100)/100}</div>
            <div class="datacell">{station.name}</div>
            <div class="datacell">{station.num_bikes_available}</div>
            <div class="datacell">{station.num_docks_available}</div>  
      {/each}
    </div>
</div>

<style>
    .datatable {
        display: grid;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .datahead {
        position: relative;
        width: 100%;
        height: 35px;
        font-weight: 700;
    }

    .databody {
        height: calc(100% - 1em);
        width: 100%;
        position: relative;
        overflow: scroll;
    }

    .datagrid {
        display: grid;
        grid-template-columns: 50px 2fr 1fr 1fr;        
    }

    .datatable-useposition--false .datagrid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;        
    }

    .datacell {
        padding: 0.5em;
        font-size: smaller;
    }

    .datacell-useposition--false {
        display: none;
    }

    .databody .datacell {
       padding-left: .8em;
    }
</style>