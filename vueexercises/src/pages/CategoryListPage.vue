<template>
  <q-page class="flex flex-center column">
    <div class="text-center">
      <div class="text-h2 q-mt-lg">Categories</div>
    </div>

    <div class="status q-mt-md text-subtitle2 text-negative" text-color="red">
      {{ state.status }}
    </div>

    <div class="q-mt-md q-mb-md text-center">
      <q-select
        map-options
        v-if="state.categories.length > 0"
        style="width: 50vw; background-color: #fff"
        :option-value="'id'"
        :option-label="'name'"
        :options="state.categories"
        label="Select a Category"
        v-model="state.selectedCategoryId"
        @update:model-value="getMenuitems()"
        emit-value
      />
    </div>

    <div
      class="text-h6 text-bold text-center text-primary q-mb-md"
      v-if="state.menuitems.length > 0"
    >
      {{ state.selectedCategory.name }} ITEMS
    </div>

    <q-scroll-area style="height: 55vh; width: 100%">
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item
            @click="selectedMenuItem(item.id)"
            clickable
            v-for="item in state.menuitems"
            :key="item.id"
          >
            <q-item-section avatar>
              <q-avatar>
                <img :src="`/burger.jpg`" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
              {{ item.description }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>
    <q-dialog
      v-model="state.itemSelected"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card>
        <q-card-actions align="right">
          <q-btn flat label="X" color="primary" v-close-popup class="text-h5" />
        </q-card-actions>
        <q-card-section>
          <div class="text-subtitle2 text-center">
            {{ state.selectedMenuItem.description }}
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar size="150px">
            <img :src="`/burger.jpg`" />
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <q-chip icon="bookmark" color="primary" text-color="white">
            Nutritional Info
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              text-color="white"
            >
              {{ state.selectedMenuItem.protein }}
            </q-tooltip>
          </q-chip>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <q-input
              v-model.number="state.qty"
              type="number"
              filled
              placeholder="qty"
              hint="Qty"
              dense
              style="max-width: 12vw"
            />&nbsp;
            <q-btn
              color="primary"
              label="Add To Tray"
              :disable="state.qty < 0"
              @click="addToTray()"
              style="max-width: 25vw; margin-left: 3vw"
            />
            <q-btn
              color="primary"
              label="View To Tray"
              :disable="state.qty < 0"
              @click="viewTray()"
              style="max-width: 25vw; margin-left: 3vw"
            />
          </div>
        </q-card-section>
        <q-card-section class="text-center text-positive">
          {{ state.dialogStatus }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { fetcher } from "../utils/apiutil";
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    onMounted(() => {
      loadCategories();
    });

    const router = useRouter();

    let state = reactive({
      status: "",
      categories: [],
      menuitems: [],
      selectedCategory: {},
      selectedCategoryId: "",
      selectedMenuItem: {},
      dialogStatus: "",
      itemSelected: false,
      qty: 0,
      tray: [],
    });

    const loadCategories = async () => {
      try {
        state.status = "Loading categories ...";
        let result = await fetcher(`Category`);
        state.categories = result;
        state.status = "Categories loaded successfully!";
      } catch (err) {
        console.log(err);
        state.status = `Error has occurred: ${err.message}`;
      }
    };

    const getMenuitems = async () => {
      try {
        state.selectedCategory = state.categories.find(
          (category) => category.id === state.selectedCategoryId
        );
        state.status = `finding menuitems for category ${state.selectedCategory.name}...`;
        state.menuitems = await fetcher(
          `Menuitem/${state.selectedCategory.id}`
        );
        state.status = `loaded ${state.menuitems.length} menu items for ${state.selectedCategory.name}`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occurred: ${err.message}`;
      }
    };

    const selectedMenuItem = async (menuitemid) => {
      try {
        state.selectedMenuItem = state.menuitems.find(
          (item) => item.id === menuitemid
        );
        state.itemSelected = true;
        state.dialogStatus = "";
        if (sessionStorage.getItem("tray")) {
          state.tray = JSON.parse(sessionStorage.getItem("tray"));
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const addToTray = () => {
      let index = -1;
      if (state.tray.length > 0) {
        index = state.tray.findIndex(
          (item) => item.id === state.selectedMenuItem.id
        );
      }
      if (state.qty > 0) {
        index === -1 // add
          ? state.tray.push({
              id: state.selectedMenuItem.id,
              qty: state.qty,
              item: state.selectedMenuItem,
            })
          : (state.tray[index] = {
              // replace
              id: state.selectedMenuItem.id,
              qty: state.qty,
              item: state.selectedMenuItem,
            });
        state.dialogStatus = `${state.qty} item(s) added`;
      } else {
        index === -1 ? null : state.tray.splice(index, 1); // remove
        state.dialogStatus = `item(s) removed`;
      }
      sessionStorage.setItem("tray", JSON.stringify(state.tray));
      state.qty = 0;
    };

    const viewTray = () => {
      router.push("tray");
    };

    return {
      state,
      loadCategories,
      getMenuitems,
      selectedMenuItem,
      addToTray,
      viewTray,
    };
  },
};
</script>

<style>
.text-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
