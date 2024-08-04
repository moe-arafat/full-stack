<template>
  <div class="text-center q-mt-lg">
    <q-avatar size="xxl">
      <img src="../../public/img/logo.png" alt="Casestudy Logo" />
    </q-avatar>
  </div>
  <div class="text-h4 text-center q-mt-md q-mb-md text-primary">Login</div>
  <div class="text-title2 text-center text-negative text-bold q-mt-sm">
    {{ state.status }}
  </div>
  <q-card class="q-ma-md q-pa-md">
    <q-form
      ref="myForm"
      class="q-gutter-md"
      greedy
      @submit="login"
      @reset="resetFields"
    >
      <q-input
        outlined
        placeholder="Email"
        v-model="state.email"
        :rules="[isRequired, isValidEmail]"
      />
      <q-input
        outlined
        type="password"
        placeholder="Password"
        v-model="state.password"
        :rules="[isRequired]"
      />
      <q-btn label="Login" type="submit" />
      <q-btn label="Reset" type="reset" />
    </q-form>
  </q-card>
</template>

<script>
import { reactive } from "vue";
import { poster } from "../utils/apiutil";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    let state = reactive({
      status: "",
      email: "",
      password: "",
    });
    const router = useRouter();
    const route = useRoute();

    const isRequired = (val) => !!val || "Field is required";
    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    };

    const login = async () => {
      state.status = "Logging in with server";
      let customerHelper = {
        email: state.email,
        password: state.password,
      };
      try {
        let payload = await poster("customer/login", customerHelper);

        if (payload.token && !payload.token.includes("login failed")) {
          sessionStorage.setItem("customer", JSON.stringify(payload));
          state.status = "Login successful";
          route.query.nextUrl
            ? router.push({ path: route.query.nextUrl })
            : router.push({ path: "/" });
        } else {
          state.status = payload.token;
        }
      } catch (err) {
        state.status = "Error: " + err.message;
      }
    };

    const resetFields = () => {
      state.email = "";
      state.password = "";
      state.status = "";
    };

    return {
      state,
      login,
      isRequired,
      isValidEmail,
      resetFields,
    };
  },
};
</script>
