<script setup>
import { ref, watch, provide, computed } from "vue";
import { useRoute } from "vue-router";

import DashboardHeader from "@/components/DashboardHeader.vue";
import Drawer from "@/components/Drawer.vue";

/* Корзина (START)*/
const cart = ref([]);

const drawerOpen = ref(false);

const closeDrawer = () => {
  drawerOpen.value = false;
};

const openDrawer = () => {
  drawerOpen.value = true;
};

const addToCart = (item) => {
  cart.value.push(item);
  item.isAdded = true;
};

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1);
  item.isAdded = false;
};

const totalPrice = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.price, 0);
});

const vatPrice = computed(() => {
  return Math.round(totalPrice.value * 5) / 100;
});

const route = useRoute(); 

const showHeader = computed(() => {
  const hiddenRoutes = ['/login', '/signup', '/verify', '/'];
  return !hiddenRoutes.includes(route.path);
});

watch(
  () => JSON.parse(JSON.stringify(cart.value)),
  (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  },
  { deep: true }
);

provide("cart", {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
});
/* Корзина (END)*/
</script>

<template>
  <div class="bg-white w-4/5 m-auto h-fit rounded-xl shadow-xl mt-10">
    <Drawer
      v-if="drawerOpen && showHeader"
      :total-price="totalPrice"
      :vat-price="vatPrice"
    />
    <DashboardHeader
     v-if="showHeader"
     @open-drawer="openDrawer" :total-price="totalPrice" />

    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>
