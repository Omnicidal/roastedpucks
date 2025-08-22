import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import EntryList from "./components/EntryList.vue";
import EntryEdit from "./components/EntryEdit.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "list", component: EntryList },
  { path: "/edit/:id", name: "edit", component: EntryEdit, props: true },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
