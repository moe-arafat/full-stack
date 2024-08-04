<template>
  <q-page class="flex flex-center column">
    <div class="text-center q-mt-lg">
      <q-avatar size="xxl">
        <img src="../../public/img/logo.png" alt="Casestudy Logo" />
      </q-avatar>
      <div class="text-h2 q-mt-md">Brands</div>
    </div>
    <div class="status q-mt-md text-subtitle2 text-negative" text-color="red">
      {{ state.status }}
    </div>

    <div class="q-mt-md q-mb-md text-center">
      <q-select
        map-options
        v-if="state.brands.length > 0"
        style="width: 50vw; background-color: #fff"
        :option-value="'id'"
        :option-label="'name'"
        :options="state.brands"
        label="Select a Brand"
        v-model="state.selectedBrandId"
        @update:model-value="getProducts"
        emit-value
      />
    </div>

    <div
      class="text-h6 text-bold text-center text-primary q-mb-md"
      v-if="state.products.length > 0"
    >
      {{ state.selectedBrand.name }} Products
    </div>

    <q-scroll-area style="height: 55vh; width: 100%">
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item
            @click="selectProduct(product.id)"
            clickable
            v-for="product in state.products"
            :key="product.id"
          >
            <q-item-section avatar>
              <q-avatar style="height: 125px; width: 90px" square>
                <img :src="`/img/${product.graphicName}`" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
              {{ product.description }}
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
            {{ state.selectedProduct.description }}
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar size="150px">
            <img :src="`/img/${state.selectedProduct.graphicName}`" />
          </q-avatar>
        </q-card-section>
        <q-card-section class="text-center">
          {{ formatCurrency(state.selectedProduct.msrp) }}
        </q-card-section>
        <q-card-section>
          <q-chip icon="bookmark" color="primary" text-color="white">
            Product Info
            <q-tooltip
              transition-show="flip-right"
              transition-hide="flip-left"
              text-color="white"
            >
              {{ state.selectedProduct.description }}
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
              label="Add To Cart"
              :disable="state.qty < 0"
              @click="addToCart()"
              style="max-width: 25vw; margin-left: 3vw"
            />
            <q-btn
              color="primary"
              label="View Cart"
              :disable="state.qty < 0"
              @click="viewCart()"
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
import { reactive, onMounted } from "vue";
import { fetcher } from "../utils/apiutil";
import { formatCurrency } from "../utils/formatutils";
import { useRouter } from "vue-router";

export default {
  setup() {
    onMounted(() => {
      loadBrands();
    });

    const router = useRouter();

    const state = reactive({
      status: "",
      brands: [],
      products: [],
      selectedBrand: {},
      selectedBrandId: "",
      selectedProduct: {},
      dialogStatus: "",
      itemSelected: false,
      qty: 0,
      cart: [],
    });

    const loadBrands = async () => {
      try {
        state.status = "Loading brands ...";
        let result = await fetcher(`Brand`);
        state.brands = result; // Load brands into state
        state.status = "Brands loaded successfully!";
      } catch (err) {
        console.log(err);
        state.status = `Error has occurred: ${err.message}`;
      }
    };

    const getProducts = async () => {
      try {
        state.selectedBrand = state.brands.find(
          (brand) => brand.id === state.selectedBrandId
        );
        state.status = `finding products for brand ${state.selectedBrand.name}...`;
        state.products = await fetcher(`Product/${state.selectedBrand.id}`);
        state.status = `loaded ${state.products.length} products for ${state.selectedBrand.name}`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occurred: ${err.message}`;
      }
    };

    const selectProduct = async (productId) => {
      try {
        state.selectedProduct = state.products.find(
          (product) => product.id === productId
        );
        state.itemSelected = true;
        state.dialogStatus = "";
        if (sessionStorage.getItem("cart")) {
          state.cart = JSON.parse(sessionStorage.getItem("cart"));
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const addToCart = () => {
      let index = -1;
      if (state.cart.length > 0) {
        index = state.cart.findIndex(
          (item) => item.id === state.selectedProduct.id
        );
      }
      if (state.qty > 0) {
        index === -1 // add
          ? state.cart.push({
              id: state.selectedProduct.id,
              qty: state.qty,
              item: state.selectedProduct,
            })
          : (state.cart[index] = {
              // replace
              id: state.selectedProduct.id,
              qty: state.qty,
              item: state.selectedProduct,
            });
        state.dialogStatus = `${state.qty} item(s) added`;
      } else {
        index === -1 ? null : state.cart.splice(index, 1); // remove
        state.dialogStatus = `item(s) removed`;
      }
      sessionStorage.setItem("cart", JSON.stringify(state.cart));
      state.qty = 0;
    };

    const viewCart = () => {
      router.push("cart");
    };

    return {
      state,
      loadBrands,
      getProducts,
      selectProduct,
      addToCart,
      viewCart,
      formatCurrency,
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
