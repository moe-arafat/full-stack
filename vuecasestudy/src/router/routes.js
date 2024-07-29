const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("pages/HomePage.vue"),
      },
      {
        path: "/brands",
        name: "brands",
        component: () => import("pages/BrandListPage.vue"),
      },
      {
        path: "/cart",
        name: "Cart",
        component: () => import("pages/CartPage.vue"),
      },
      // Login Page
      {
        path: "/login",
        name: "Login",
        component: () => import("pages/LoginPage.vue"),
      },
      // Register Page
      {
        path: "/register",
        name: "Register",
        component: () => import("pages/RegisterPage.vue"),
      },
      // Logout Page
      {
        path: "/logout",
        name: "Logout",
        component: () => import("pages/LogoutPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
