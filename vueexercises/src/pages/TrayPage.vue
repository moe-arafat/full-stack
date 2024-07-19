<template>
  <div class="text-center">
    <div class="text-h4 q-mt-md text-primary">Tray Contents</div>
    <q-avatar class="q-mt-md" size="xl" square>
      <img src="tray.png" alt="Tray Image" />
    </q-avatar>
    <div class="text-h6 text-positive">{{ state.status }}</div>
    <q-scroll-area>
      <q-list>
        <q-item v-for="(trayItem, index) in state.tray" :key="index">
          <q-item-section>{{ trayItem.qty }}</q-item-section>
          <q-item-section v-if="trayItem.item">{{
            trayItem.item.description
          }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    <q-btn @click="clearTray">Clear Tray</q-btn>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";

export default defineComponent({
  setup() {
    const state = reactive({
      tray: [],
      status: "",
    });

    onMounted(() => {
      const tray = JSON.parse(sessionStorage.getItem("tray"));
      if (tray) {
        state.tray = tray;
        state.status = "Items loaded";
      } else {
        state.status = "Tray is empty";
      }
    });

    const clearTray = () => {
      sessionStorage.removeItem("tray");
      state.tray = [];
      state.status = "Tray cleared";
    };

    return {
      state,
      clearTray,
    };
  },
});
</script>
