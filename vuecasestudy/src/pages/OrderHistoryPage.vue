<template>
  <div class="text-center">
    <div class="text-h4 q-mt-md text-primary">Order History</div>
    <q-avatar class="q-mt-md" size="xl" square>
      <img src="cart.png" alt="Order Icon" />
    </q-avatar>
    <q-scroll-area style="height: 55vh; width: 90%">
      <q-item style="bottom: -2vh" class="q-pa-md">
        <q-item-section class="col-2 q-ml-sm text-h6 text-primary text-left">ID</q-item-section>
        <q-item-section class="col-5 q-ml-sm text-h6 text-primary text-left">Date Created</q-item-section>
      </q-item>
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item v-for="order in orders" :key="order.id" clickable @click="selectOrder(order.id)">
            <q-item-section class="col-2 q-ml-sm text-left">
              {{ order.id }}
            </q-item-section>
            <q-item-section class="col-5 q-ml-sm text-left">
              {{ formatDate(order.orderDate) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>

    <!-- Dialog for Order Details -->
    <q-dialog v-model="dialogVisible">
      <q-card v-if="selectedOrder">
        <q-card-section class="text-center">
          <div class="text-h5">Order {{ selectedOrder.id }}</div>
          <div>{{ formatDate(selectedOrder.orderDate) }}</div>
          <q-avatar class="q-mt-md" size="xl" square>
            <img src="cart.png" alt="Order Icon" />
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <q-table
            :rows="state.orderDetails"
            :columns="columns"
            row-key="productId"
            hide-bottom
            flat
            no-header
            dense
            class="q-pa-none"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                {{ props.row.productName }}
              </q-td>
            </template>
            <template v-slot:body-cell-ordered="props">
              <q-td :props="props">
                {{ props.row.qtyOrdered }}
              </q-td>
            </template>
            <template v-slot:body-cell-sold="props">
              <q-td :props="props">
                {{ props.row.qtySold }}
              </q-td>
            </template>
            <template v-slot:body-cell-backordered="props">
              <q-td :props="props">
                {{ props.row.qtyBackOrdered }}
              </q-td>
            </template>
            <template v-slot:body-cell-extended="props">
              <q-td :props="props">
                {{ formatCurrency(props.row.sellingPrice) }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-card-section>
          <div class="text-right q-mt-sm">
            <div>Sub: ${{ formatCurrency(state.subtotal || 0) }}</div>
            <div>Tax (13%): ${{ formatCurrency(state.tax || 0) }}</div>
            <div class="text-h6">Total: <span class="text-primary">${{ formatCurrency(state.total || 0) }}</span></div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn flat color="primary" label="details for order" />
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
import { formatCurrency, formatDate } from '../utils/formatutils';

export default {
  setup() {
    const orders = ref([]);
    const dialogVisible = ref(false);
    const selectedOrder = ref(null);

    const state = reactive({
      orderDetails: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });

    const columns = [
      { name: 'name', label: 'Name', align: 'left', field: 'productName' },
      { name: 'ordered', label: 'Ordered', align: 'center', field: 'qtyOrdered' },
      { name: 'sold', label: 'Sold', align: 'center', field: 'qtySold' },
      { name: 'backordered', label: 'BackOrdered', align: 'center', field: 'qtyBackOrdered' },
      { name: 'extended', label: 'Extended', align: 'right', field: 'extended' }
    ];

    const fetchOrders = async () => {
      try {
        const customer = JSON.parse(sessionStorage.getItem('customer'));
        if (!customer || !customer.email) {
          throw new Error('Customer not logged in or email missing');
        }
        const response = await fetcher(`order/${customer.email}`);
        orders.value = response;
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    const selectOrder = async (orderId) => {
      try {
        const customer = JSON.parse(sessionStorage.getItem('customer'));
        if (!customer || !customer.email) {
          throw new Error('Customer not logged in or email missing');
        }
        const response = await fetcher(`order/${orderId}/${customer.email}`);

        console.log('Order details:', response); // Debugging line

        const fetchedDetails = response.map(item => ({
          ...item,
          sellingPrice: item.sellingPrice || 0  // Fetch the sellingPrice from the OrderLineItems table
        }));

        let subtotal = 0;
        fetchedDetails.forEach(item => {
          subtotal += (item.sellingPrice || 0) * (item.qtySold || 0);
        });

        const tax = subtotal * 0.13;
        const total = subtotal + tax;

        state.orderDetails = fetchedDetails;
        state.subtotal = subtotal.toFixed(2);
        state.tax = tax.toFixed(2);
        state.total = total.toFixed(2);

        selectedOrder.value = orders.value.find(order => order.id === orderId);
        dialogVisible.value = true;
      } catch (error) {
        console.error('Error fetching order details:', error.message);
      }
    };

    onMounted(fetchOrders);

    return {
      orders,
      dialogVisible,
      selectedOrder,
      state,
      columns,
      formatCurrency,
      selectOrder,
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
.text-h6 {
  font-weight: 500;
}
.text-primary {
  color: #1a73e8;
}
.text-right {
  text-align: right;
}
.q-avatar {
  margin-bottom: 16px;
}
</style>
