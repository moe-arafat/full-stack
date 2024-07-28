<template>
  <div class="text-h4 text-center q-mt-md q-mb-md text-primary">Logout</div>
  <div class="text-title2 text-center text-positive text-bold q-mt-sm">
    {{ state.status }}
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    let state = {
      status: "Logging out...",
    };

    onMounted(() => {
      sessionStorage.clear();
      state.status = "Logged out";
      router.push({ path: "/login" });
    });

    return {
      state,
    };
  },
};
</script>
