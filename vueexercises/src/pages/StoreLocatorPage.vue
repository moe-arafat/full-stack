<template>
  <div class="text-center q-mt-md">
    <div class="text-h4">Store Locator</div>

    <div>
      <q-input
        class="q-ma-lg text-h5"
        placeholder="Enter current address"
        v-model="state.address"
      />
      <br />
    </div>
    <q-btn
      label="Find Stores"
      @click="getMap"
      class="q-mb-md"
      style="width: 30vw"
    />
    <div
      style="height: 50vh; width: 90vw; margin-left: 5vw; border: solid"
      ref="mapRef"
      v-show="state.showmap === true"
    ></div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { fetcher } from "src/utils/apiutil";

export default {
  name: "StoreLocatorPage",
  setup() {
    const mapRef = ref(null);
    let state = reactive({
      status: "",
      address: "",
      showmap: false,
    });

    const getMap = async () => {
      try {
        state.showmap = true;
        const tt = window.tt;
        let url = `https://api.tomtom.com/search/2/geocode/${state.address}.json?key=lpevgGa22x3e7SUdUePZInlJziVdiwVc`;
        let response = await fetch(url);
        let payload = await response.json();
        let lat = payload.results[0].position.lat;
        let lon = payload.results[0].position.lon;

        let threeStores = await fetcher(`store/${lat}/${lon}`);

        let map = tt.map({
          key: "lpevgGa22x3e7SUdUePZInlJziVdiwVc",
          container: mapRef.value,
          source: "vector/1/basic-main",
          center: [lon, lat],
          zoom: 8,
        });

        map.addControl(new tt.FullscreenControl());
        map.addControl(new tt.NavigationControl());

        threeStores.forEach((store) => {
          let marker = new tt.Marker()
            .setLngLat([store.longitude, store.latitude])
            .addTo(map);
          let popupOffset = 25;
          let popup = new tt.Popup({ offset: popupOffset });
          popup.setHTML(
            `<div id="popup">Store#: ${store.id}</div><div>${store.street}, ${
              store.city
            }
 <br/>${store.distance.toFixed(2)} mi</div>`
          );
          marker.setPopup(popup);
        });
      } catch (err) {
        console.error(err.message);
      }
    };

    return {
      mapRef,
      state,
      getMap,
    };
  },
};
</script>
