const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("pages/HomePage.vue") },
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
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
