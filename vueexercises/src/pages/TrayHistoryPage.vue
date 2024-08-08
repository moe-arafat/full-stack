<template>
  <div class="text-center">
    <div class="text-h4 q-mt-md text-primary">Tray History</div>
    <div class="text-h6 text-negative q-mt-sm">loaded {{ trays.length }} trays</div>
    <q-scroll-area style="height: 55vh; width: 100%">
      <q-item style="bottom: -2vh" class="q-pa-md">
        <q-item-section class="col-2 q-ml-sm text-h6 text-primary text-left">ID</q-item-section>
        <q-item-section class="col-5 q-ml-sm text-h6 text-primary text-left">Date Created</q-item-section>
        <q-item-section class="col-5 q-ml-sm text-h6 text-primary text-left">Total Cals.</q-item-section>
      </q-item>
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item v-for="tray in trays" :key="tray.id" clickable @click="selectTray(tray.id)">
            <q-item-section class="col-2 q-ml-sm text-left">
              {{ tray.id }}
            </q-item-section>
            <q-item-section class="col-5 q-ml-sm text-left">
              {{ formatDate(tray.dateCreated) }}
            </q-item-section>
            <q-item-section class="col-5 q-ml-sm text-left">
              {{ tray.totalCalories }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>

    <!-- Dialog for Tray Details -->
    <q-dialog v-model="dialogVisible">
      <q-card v-if="selectedTray">
        <q-card-section class="text-center">
          <div class="text-h5">Tray #{{ selectedTray.id }}</div>
          <div>{{ formatDate(selectedTray.dateCreated) }}</div>
          <q-avatar class="q-mt-md" size="xl" square>
            <img src="tray.png" alt="Tray Image" />
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item style="bottom: -2vh" class="q-pa-md">
              <q-item-section class="col-2 q-ml-sm text-h6 text-primary text-left">Qty</q-item-section>
              <q-item-section class="col-10 q-ml-sm text-h6 text-primary text-left">Menu Item</q-item-section>
            </q-item>
            <q-item v-for="item in trayDetails" :key="item.menuItemId">
              <q-item-section class="col-2 q-ml-sm text-left">
                {{ item.qty }}
              </q-item-section>
              <q-item-section class="col-10 q-ml-sm text-left">
                {{ item.description }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section class="text-center">
          <q-chip icon="bookmark" color="primary" text-color="white">
            Nutritional Totals
            <q-tooltip transition-show="flip-right" transition-hide="flip-left" text-color="white">
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
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { fetcher } from '../utils/apiutil';
import { formatDate } from '../utils/formatutils';

export default {
  setup() {
    const trays = ref([]);
    const trayDetails = ref([]);
    const dialogVisible = ref(false);
    const selectedTray = ref(null);
    const state = reactive({
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

    const fetchTrays = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const response = await fetcher(`tray/${user.email}`);
        trays.value = response;
      } catch (error) {
        console.error('Error fetching trays:', error);
      }
    };

    const selectTray = async (trayId) => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const response = await fetcher(`tray/${trayId}/${user.email}`);
        trayDetails.value = response;
        selectedTray.value = trays.value.find(tray => tray.id === trayId);

        state.totalCal = 0;
        state.totalChol = 0;
        state.totalFib = 0;
        state.totalCar = 0;
        state.totalFat = 0;
        state.totalSal = 0;
        state.totalProt = 0;

        trayDetails.value.forEach((trayItem) => {
          state.totalCal += trayItem.totalCalories * trayItem.qty;
          state.totalChol += trayItem.totalCholesterol * trayItem.qty;
          state.totalFib += trayItem.totalFibre * trayItem.qty;
          state.totalCar += trayItem.totalCarbs * trayItem.qty;
          state.totalFat += trayItem.totalFat * trayItem.qty;
          state.totalSal += trayItem.totalSalt * trayItem.qty;
          state.totalProt += trayItem.totalProtein * trayItem.qty;
        });

        dialogVisible.value = true;
      } catch (error) {
        console.error('Error fetching tray details:', error);
      }
    };

    onMounted(fetchTrays);

    return {
      trays,
      trayDetails,
      selectedTray,
      state,
      dialogVisible,
      selectTray,
      formatDate
    };
  }
};
</script>

<style scoped>
.q-pa-md {
  padding: 16px;
}
.q-mb-md {
  margin-bottom: 16px;
}
.q-list {
  max-height: 70vh;
  overflow-y: auto;
}
.q-card {
  width: 100%;
}
.text-negative {
  color: #f44336;
}
</style>
