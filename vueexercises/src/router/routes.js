const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // Home Page
      {
        path: "/",
        name: "home",
        component: () => import("pages/HomePage.vue"),
      },
      // About Page
      {
        path: "/about",
        name: "about",
        component: () => import("pages/AboutPage.vue"),
      },
      // Util Page
      {
        path: "/util",
        name: "util",
        component: () => import("pages/UtilPage.vue"),
      },
      // Category List Page
      {
        path: "/categoryList",
        name: "Category List",
        component: () => import("pages/CategoryListPage.vue"),
      },
      // Tray List Page
      {
        path: "/tray",
        name: "Tray List",
        component: () => import("pages/TrayPage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
