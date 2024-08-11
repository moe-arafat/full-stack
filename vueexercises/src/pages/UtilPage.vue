<template>
  <div class="text-center q-mt-lg">
    <div class="text-h4">Data Utility</div>
    <q-btn
      class="q-ma-sm"
      color="white"
      text-color="black"
      label="Load Categories"
      @click="loadCategories"
    />
    <q-btn
      class="q-ma-sm"
      color="white"
      text-color="black"
      label="Load Stores"
      @click="loadStores"
    />
    <div class="status q-mt-md text-subtitle2 text-negative" text-color="red">
      {{ state.status }}
    </div>
  </div>
</template>
<script>
import { reactive } from "vue";
import { fetcher } from "../utils/apiutil";
export default {
  setup() {
    let state = reactive({
      status: "",
    });
    const loadCategories = async () => {
      try {
        state.status = "resetting tables ...";
        let payload = await fetcher("Data");
        state.status = payload;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };
    const loadStores = async () => {
      try {
        state.status = "loading store data ...";
        let payload = await fetcher("Data/loadstores");
        state.status = payload;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };
    return {
      loadCategories,
      loadStores,
      state,
    };
  },
};
</script>
