<template>
  <div class="text-center q-pa-md">
    <q-avatar size="xxl">
      <img src="../../public/img/logo.png" alt="Casestudy Logo" />
    </q-avatar>
    <div class="text-h4 q-mt-md text-primary">Cart Contents</div>
    <q-avatar class="q-mt-md" size="xl" square>
      <img src="cart.png" alt="Cart Image" />
    </q-avatar>
    <div class="text-h6 text-positive">{{ state.status }}</div>
    <q-scroll-area style="height: 55vh; width: 100%">
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item class="q-pa-xs">
            <q-item-section class="col-3 text-small text-primary text-left">
              Name
            </q-item-section>
            <q-item-section class="col-2 text-small text-primary text-left">
              Qty
            </q-item-section>
            <q-item-section class="col-3 text-small text-primary text-left">
              MSRP
            </q-item-section>
            <q-item-section class="col-4 text-small text-primary text-left">
              Extended
            </q-item-section>
          </q-item>
          <q-item
            v-for="cartItem in state.cart"
            :key="cartItem.id"
            class="q-pa-xs"
          >
            <q-item-section class="col-3 text-small text-left">
              {{ cartItem.item.productName }}
            </q-item-section>
            <q-item-section class="col-2 text-small text-left">
              {{ cartItem.qty }}
            </q-item-section>
            <q-item-section class="col-3 text-small text-left">
              {{ formatCurrency(cartItem.item.msrp) }}
            </q-item-section>
            <q-item-section class="col-4 text-small text-left">
              {{ formatCurrency(cartItem.item.msrp * cartItem.qty) }}
            </q-item-section>
          </q-item>
          <q-item class="q-pa-xs">
            <q-item-section class="col-8 text-right">
              <span class="text-small">Sub:</span>
            </q-item-section>
            <q-item-section class="col-4 text-left">
              <span class="text-small">{{
                formatCurrency(state.subtotal)
              }}</span>
            </q-item-section>
          </q-item>
          <q-item class="q-pa-xs">
            <q-item-section class="col-8 text-right">
              <span class="text-small">Tax(13%):</span>
            </q-item-section>
            <q-item-section class="col-4 text-left">
              <span class="text-small">{{ formatCurrency(state.tax) }}</span>
            </q-item-section>
          </q-item>
          <q-item class="q-pa-xs">
            <q-item-section class="col-8 text-right">
              <span class="text-small text-bold">Total:</span>
            </q-item-section>
            <q-item-section class="col-4 text-left">
              <span class="text-small text-bold">{{
                formatCurrency(state.total)
              }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>
    <q-card-section>
      <q-btn
        @click="clearCart"
        icon="delete"
        label="Empty Cart"
        color="primary"
      ></q-btn>
    </q-card-section>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { formatCurrency } from "../utils/formatutils";

export default {
  setup() {
    let state = reactive({
      status: "",
      cart: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });

    const calculateTotals = () => {
      state.subtotal = state.cart.reduce(
        (acc, item) => acc + item.item.msrp * item.qty,
        0
      );
      state.tax = state.subtotal * 0.13;
      state.total = state.subtotal + state.tax;
    };

    onMounted(() => {
      const fetchedCart = JSON.parse(sessionStorage.getItem("cart"));
      state.cart = fetchedCart;
      calculateTotals();
    });

    const clearCart = () => {
      sessionStorage.removeItem("cart");
      state.cart = [];
      state.subtotal = 0;
      state.tax = 0;
      state.total = 0;
      state.status = "cart cleared";
    };

    return {
      state,
      clearCart,
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

.q-pa-md {
  padding: 16px;
}

.q-ma-md {
  margin: 16px;
}

.q-pa-xs {
  padding: 8px;
}

.text-small {
  font-size: 12px;
}

.text-bold {
  font-weight: bold;
}
</style>
