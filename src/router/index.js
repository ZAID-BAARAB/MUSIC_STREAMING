import { createRouter, createWebHistory } from "vue-router";
import useUserStore from "@/stores/user";

const Home = () => import("@/views/Home.vue");
const About = () => import("@/views/About.vue");
const Manage = () => import("@/views/Manage.vue");
const Song = () => import("@/views/Song.vue");
const Favourites = () => import("@/views/Favourites.vue");
const Notifications = () => import("@/views/Notifications.vue");
const Profile = () => import("@/views/Profile.vue");
const Navbar = () => import("@/components/navbar.vue");
const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
  },
  {
    name: "navbar",
    path: "/navbar",
    component: Navbar,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    // alias: "/manage",
    path: "/manage-music",
    component: Manage,
    beforeEnter(to, from, next) {
      console.log("Manage Route Guard");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  {
    name: "favourites",
    path: "/favourites",
    component: Favourites,
  },
  {
    name: "notifications",
    path: "/notifications",
    component: Notifications,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  // console.log("Global Guard");

  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const store = useUserStore();

  if (store.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
