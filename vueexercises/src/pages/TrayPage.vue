<template>
  <div class="text-center">
    <div class="text-h4 q-mt-md text-primary">Tray Contents</div>
    <q-avatar class="q-mt-md" size="xl" square>
      <img src="tray.png" alt="Tray Image" />
    </q-avatar>
    <div class="text-h6 text-positive">{{ state.status }}</div>
    <q-scroll-area style="height: 55vh; width: 100%">
      <q-item style="bottom: -2vh" class="q-pa-md">
        <q-item-section class="col-2 q-ml-sm text-h6 text-primary text-left"
          >QTY</q-item-section
        >
        <q-item-section class="col-8 q-ml-sm text-h6 text-primary text-left"
          >DESCRIPTION</q-item-section
        >
      </q-item>
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item v-for="trayItem in state.tray" :key="trayItem.id">
            <q-item-section class="col-2 q-ml-sm text-left">
              {{ trayItem.qty }}
            </q-item-section>
            <q-item-section class="col-8 q-ml-sm text-left">
              {{ trayItem.item.description }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>

    <q-card-section>
      <q-chip icon="bookmark" color="primary" text-color="white">
        Nutritional Totals
        <q-tooltip
          transition-show="flip-right"
          transition-hide="flip-left"
          text-color="white"
        >
          <div>Cal: {{ state.totalCal }}</div>
          <div>Chol: {{ state.totalChol }}</div>
          <div>Fib: {{ state.totalFib }}</div>
          <div>Car: {{ state.totalCar }}</div>
          <div>Fat: {{ state.totalFat }}</div>
          <div>Sal: {{ state.totalSal }}</div>
          <div>Prot: {{ state.totalProt }}</div>
        </q-tooltip>
      </q-chip>
    </q-card-section>
    <q-card-section></q-card-section>
    <q-btn @click="clearTray">Clear Tray</q-btn>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";

export default {
  setup() {
    let state = reactive({
      status: "",
      tray: [],
      totalCal: 0,
      totalChol: 0,
      totalFib: 0,
      totalCar: 0,
      totalFat: 0,
      totalSal: 0,
      totalProt: 0,
    });

    onMounted(() => {
      const fetchedTray = JSON.parse(sessionStorage.getItem("tray"));

      fetchedTray.forEach((trayItem) => {
        state.totalCal += trayItem.item.calories * trayItem.qty;
        state.totalChol += trayItem.item.cholesterol * trayItem.qty;
        state.totalFib += trayItem.item.fiber * trayItem.qty;
        state.totalCar += trayItem.item.carbs * trayItem.qty;
        state.totalFat += trayItem.item.fat * trayItem.qty;
        state.totalSal += trayItem.item.salt * trayItem.qty;
        state.totalProt += trayItem.item.protein * trayItem.qty;
      });

      state.tray = fetchedTray;
    });

    const clearTray = () => {
      sessionStorage.removeItem("tray");
      state.tray = [];
      state.status = "tray cleared";
    };

    return {
      state,
      clearTray,
    };
  },
};
</script>
